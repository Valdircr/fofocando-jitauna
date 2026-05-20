import { NextResponse } from "next/server";
import mongoose from "mongoose";

const MONGODB_URI = "mongodb://fofoca_db_user:2211v2211@ac-v5ol0nc-shard-00-00.sevii59.mongodb.net:27017,ac-v5ol0nc-shard-00-01.sevii59.mongodb.net:27017,ac-v5ol0nc-shard-00-02.sevii59.mongodb.net:27017/?ssl=true&replicaSet=atlas-zcxldy-shard-0&authSource=admin&appName=Cluster0";

const PALAVRAS_PROIBIDAS = ["palavrao1", "palavrao2", "racismo", "preconceito", "ameaça"];

const FofocaSchema = new mongoose.Schema({
  texto: String,
  status: { type: String, default: "pendente" },
  data: { type: Date, default: Date.now },
  denuncias: { type: Number, default: 0 }, // Nova camada: contador de denúncias
});
const FofocaModel = mongoose.models.Fofoca || mongoose.model("Fofoca", FofocaSchema);

export async function POST(request) {
  try {
    const { texto } = await request.json();
    
    // --- BLINDAGEM 1: VALIDAÇÃO DE TAMANHO ---
    if (!texto || texto.trim().length === 0) {
      return NextResponse.json({ error: "A fofoca não pode estar vazia!" }, { status: 400 });
    }
    if (texto.length > 500) {
      return NextResponse.json({ error: "Texto muito longo! Máximo de 500 caracteres." }, { status: 400 });
    }

    // --- BLINDAGEM 2: FILTRO DE PALAVRÕES ---
    const textoMinusculo = texto.toLowerCase();
    const encontrouPalavrao = PALAVRAS_PROIBIDAS.some(palavra => textoMinusculo.includes(palavra));
    if (encontrouPalavrao) {
      return NextResponse.json({ error: "Conteúdo inadequado! Use palavras respeitosas." }, { status: 400 });
    }

    await mongoose.connect(MONGODB_URI);
    await FofocaModel.create({ texto });
    return NextResponse.json({ message: "Sucesso!" }, { status: 201 });
  } catch (error) { 
    return NextResponse.json({ error: error.message }, { status: 500 }); 
  }
}

export async function GET(request) {
  try {
    await mongoose.connect(MONGODB_URI);
    const fofocas = await FofocaModel.find({}).sort({ data: -1 });
    return NextResponse.json(fofocas, { status: 200 });
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function PATCH(request) {
  try {
    const { id, novoStatus, incrementarDenuncia } = await request.json();
    await mongoose.connect(MONGODB_URI);

    if (incrementarDenuncia) {
      // Logica de Denúncia: Aumenta o contador e verifica se deve ocultar
      const fofoca = await FofocaModel.findByIdAndUpdate(
        id, 
        { $inc: { denuncias: 1 } }, 
        { new: true }
      );
      
      // Se chegar a 5 denúncias, a fofoca volta a ser 'pendente' automaticamente
      if (fofoca.denuncias >= 5) {
        await FofocaModel.findByIdAndUpdate(id, { status: 'pendente' });
      }
      return NextResponse.json({ message: "Denúncia registrada!" }, { status: 200 });
    }

    await FofocaModel.findByIdAndUpdate(id, { status: novoStatus });
    return NextResponse.json({ message: "Atualizado!" }, { status: 200 });
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}
