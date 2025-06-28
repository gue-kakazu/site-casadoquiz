'use client';

import { useState } from 'react';

/* ---------- Tipo dos dados do canal ---------- */
interface Stats {
  title: string;
  subscribers: string;
  views: string;
  videos: string;
  thumbnail?: string;
}

/* Utilitário: formata números 12345 → 12 345 */
const fmt = (n: string | number) => Number(n).toLocaleString('pt-BR');

export default function ChannelInsights() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch() {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setStats(null);

    try {
      /* 🔹 Busca tudo no endpoint interno */
      const res = await fetch(`/api/channel?q=${encodeURIComponent(input.trim())}`);
      if (!res.ok) throw new Error('Falha na API interna');
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setStats({
        title: data.title,
        subscribers: fmt(data.subscribers),
        views: fmt(data.views),
        videos: fmt(data.videos),
        thumbnail: data.thumbnail,
      });
    } catch (err: any) {
      setError(err.message ?? 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Input + Botão */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="@canal, URL ou ID"
          className="flex-1 border rounded px-3 py-2 disabled:opacity-50"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          disabled={loading}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
          aria-label="Pesquisar"
        >
          {loading ? 'Carregando…' : 'Pesquisar'}
        </button>
      </div>

      {/* Erro */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Resultados */}
      {stats && (
        <>
          <h2 className="text-lg font-semibold text-center">{stats.title}</h2>
          {stats.thumbnail && (
            <img
              src={stats.thumbnail}
              alt={`${stats.title} thumbnail`}
              className="mx-auto rounded w-32 h-32 object-cover"
            />
          )}
          <div className="grid grid-cols-2 gap-4 text-center">
            <Stat label="Inscritos" value={stats.subscribers} />
            <Stat label="Visualizações" value={stats.views} />
            <Stat label="Vídeos" value={stats.videos} />
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white shadow rounded p-4">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
