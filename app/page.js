"use client";
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [fofoca, setFofoca] = useState('');
  const [feed, setFeed] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregarFeed = async () => {
    setCarregando(true);
    try {
      const res = await fetch('/api/fofocas');
      const data = await res.json();
      if (Array.isArray(data)) {
        const aprovadas = data.filter(f => f.status === 'aprovado');
        setFeed(aprovadas);
      }
    } catch (e) {
      console.error("Erro ao carregar feed:", e);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarFeed();
  }, []);

  const handleSend = async () => {
    if (fofedoca?.length < 10 || fofoca.length < 10) { // Prevenção de erro
      alert("A fofoca está muito curta! Conte mais detalhes... 😂");
      return;
    }
    try {
      const response = await fetch('/api/fofocas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: fofoca }),
      });
      if (response.ok) {
        alert("Enviado! Agora o mestre precisa aprovar para aparecer aqui. 👇");
        setFofoca(''); 
      } else {
        alert("Erro ao enviar. Tente novamente.");
      }
    } catch (error) {
      alert("Erro de conexão.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-white to-pink-100 font-sans">
      
      {/* --- TOPO COM EMOJIS DINÂMICOS (Substituindo a foto) --- */}
      <div className="relative h-64 w-full overflow-hidden bg-slate-900 shadow-2xl flex items-center justify-center text-center p-4">
        
        {/* Emojis Flutuantes de Fundo */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <span className="absolute top-10 left-10 text-4xl animate-bounce">🤫</span>
          <span className="absolute top-20 right-20 text-5xl animate-pulse">🔥</span>
          <span className="absolute bottom-10 left-20 text-4xl animate-bounce" style={{animationDelay: '1s'}}>👂</span>
          <span className="absolute bottom-20 right-10 text-5xl animate-pulse" style={{animationDelay: '0.5s'}}>💅</span>
          <span className="absolute top-1/2 left-1/4 text-3xl animate-bounce" style={{animationDelay: '1.5s'}}>🗣️</span>
          <span className="absolute top-1/3 right-1/3 text-4xl animate-pulse" style={{animationDelay: '0.8s'}}>🤐</span>
        </div>

        <div className="relative z-10">
          <div className="bg-pink-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
            🔥 O Portal do Babado
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-4 leading-tight">
            🤫 <span className="text-pink-400">Fofocando</span> <br/> em Jitaúna
          </h1>
          <p className="text-pink-100 text-lg md:text-xl font-medium max-w-2xl mx-auto opacity-90 italic">
            "Onde os segredos da cidade se encontram."
          </p>
        </div>
      </div>

      {/* --- ÁREA DE INTERAÇÃO --- */}
      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-10">
        
        {/* CARD DE ENVIO */}
        <section className="bg-white p-8 rounded-[40px] shadow-2xl border-b-8 border-pink-500 max-w-2xl mx-auto mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-pink-500 p-3 rounded-2xl text-white text-2xl shadow-lg">✍️</div>
            <h2 className="text-2xl font-bold text-gray-800">Solte o verbo!</h2>
          </div>
          
          <textarea 
            className="w-full p-5 border-2 border-pink-100 rounded-3xl focus:border-pink-400 outline-none resize-none h-32 text-gray-800 text-lg transition-all"
            placeholder="O que está acontecendo em Jitaúna? Quem? Onde?..."
            value={fofoca}
            onChange={(e) => setFofoca(e.target.value)}
          />
          
          <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
            <div className="flex items-center text-sm text-gray-400">
              <input type="checkbox" id="termos" className="mr-2 accent-pink-500 cursor-pointer" />
              <label htmlFor="termos" className="cursor-pointer">Eu aceito as regras do site</label>
            </div>
            <button 
              onClick={handleSend}
              className="w-full md:w-auto bg-pink-600 hover:bg-pink-700 text-white font-black py-4 px-10 rounded-2xl transition-all transform hover:scale-105 text-lg shadow-lg"
            >
              ENVIAR SEGREDO 🚀
            </button>
          </div>
        </section>

        {/* FEED */}
        <section>
          <div className="flex justify-between items-center mb-10">
            <div className="text-left">
              <h2 className="text-4xl font-black text-gray-800">🔥 Babados Aprovados</h2>
              <p className="text-gray-500 font-medium">Apenas as verdades aprovadas!</p>
            </div>
            <button 
              onClick={carregarFeed}
              className="bg-white text-pink-600 border-2 border-pink-600 px-6 py-2 rounded-full text-sm font-bold hover:bg-pink-600 hover:text-white transition-all shadow-sm"
            >
              🔄 Atualizar Feed
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {carregando ? (
              <p className="col-span-full text-center text-pink-500 font-bold">Buscando as fofocas...</p>
            ) : feed.length === 0 ? (
              <div className="col-span-full bg-white p-12 rounded-[40px] text-center text-gray-400 italic border-2 border-dashed border-pink-200">
                O mural está vazio... Mande seu segredo acima! 👀
              </div>
            ) : (
              feed.map((f) => (
                <div key={f._id} className="bg-white p-6 rounded-[30px] shadow-md border-t-4 border-pink-500 transition-all hover:shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-pink-100 text-pink-600 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                      👤 Anônimo
                    </span>
                    <span className="text-xs text-gray-400">{new Date(f.data).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <p className="text-gray-800 text-lg leading-relaxed font-medium">
                    "{f.texto}"
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <footer className="text-center py-16 text-pink-400 text-sm font-medium bg-pink-50 mt-20">
        © 2024 Fofocando em Jitaúna <br/> A cidade mais babadeira da Bahia! 🌸
      </footer>
    </div>
  );
}
