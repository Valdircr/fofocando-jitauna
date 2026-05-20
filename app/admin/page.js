"use client";
import React, { useEffect, useState } from 'react';

export default function Admin() {
  const [fofocas, setFofocas] = useState([]);
  const [erro, setErro] = useState(null);
  const [autenticado, setAutenticado] = useState(false); // Controla se o mestre logou
  const [senhaInput, setSenhaInput] = useState('');

  // --- DEFINA SUA SENHA DE ADMIN AQUI ---
  const SENHA_MESTRE = "admin1232211"; // Mude "admin123" para a senha que você quiser!

  const carregarFofocas = async () => {
    try {
      const res = await fetch('/api/fofocas');
      const data = await res.json();
      if (Array.isArray(data)) {
        setFofocas(data);
        setErro(null);
      } else {
        setErro(data.error || "Erro ao carregar fofocas.");
      }
    } catch (e) {
      setErro("Não foi possível conectar ao servidor.");
    }
  };

  useEffect(() => {
    if (autenticado) {
      carregarFofocas();
    }
  }, [autenticado]);

  const verificarSenha = () => {
    if (senhaInput === SENHA_MESTRE) {
      setAutenticado(true);
    } else {
      alert("Senha incorreta! Você não é o mestre. ❌");
    }
  };

  const mudarStatus = async (id, novoStatus) => {
    try {
      await fetch('/api/fofocas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, novoStatus }),
      });
      carregarFofocas(); 
    } catch (e) {
      alert("Erro ao atualizar status.");
    }
  };

  // TELA DE LOGIN (Se não estiver autenticado, mostra isso)
  if (!autenticado) {
    return (
      <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">🔐 Área do Mestre</h1>
          <p className="text-gray-500 mb-4">Insira a senha para gerenciar as fofocas</p>
          <input 
            type="password" 
            className="w-full p-3 border-2 border-gray-200 rounded-xl mb-4 outline-none focus:border-pink-500"
            placeholder="Senha secreta..."
            value={senhaInput}
            onChange={(e) => setSenhaInput(e.target.value)}
          />
          <button 
            onClick={verificarSenha}
            className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-700 transition-all"
          >
            Entrar no Painel
          </button>
        </div>
      </main>
    );
  }

  // TELA DO PAINEL (Só aparece se a senha estiver certa)
  return (
    <main className="min-h-screen bg-slate-100 p-8 font-sans">
      <div className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800">👑 Painel do Mestre</h1>
        <button 
          onClick={() => setAutenticado(false)}
          className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-200"
        >
          Sair 🚪
        </button>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-4">
        {erro && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow">
            <strong>Erro:</strong> {erro}
          </div>
        )}

        {fofocas.length === 0 && !erro && (
          <p className="text-center text-gray-500">Nenhuma fofoca encontrada.</p>
        )}
        
        {fofocas.map((f) => (
          <div key={f._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center border-l-8 border-pink-500">
            <div className="pr-4">
              <p className="text-gray-800 text-lg">{f.texto}</p>
              <span className={`text-xs font-bold uppercase ${f.status === 'pendente' ? 'text-yellow-600' : 'text-green-600'}`}>
                Status: {f.status}
              </span>
            </div>
            
            <div className="flex gap-2">
              {f.status === 'pendente' && (
                <button 
                  onClick={() => mudarStatus(f._id, 'aprovado')}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 font-bold"
                >
                  Aprovar ✅
                </button>
              )}
              <button 
                onClick={() => mudarStatus(f._id, 'apagado')}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 font-bold"
              >
                Apagar 🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
