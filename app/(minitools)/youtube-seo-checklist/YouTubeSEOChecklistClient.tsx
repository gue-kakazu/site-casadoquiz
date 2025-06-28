'use client';

import { useState } from 'react';

/* ---------- Tipo dos dados do vídeo ---------- */
interface VideoData {
  title: string;
  description: string;
  tags?: string[];
  categoryId?: string;
  defaultAudioLanguage?: string;
  duration?: string;
  viewCount?: string;
  likeCount?: string;
  commentCount?: string;
  thumbnails?: {
    default?: { url: string };
    medium?: { url: string };
    high?: { url: string };
    standard?: { url: string };
    maxres?: { url: string };
  };
}

/* Exibe 171499 → 171.499 */
const formatNumber = (num?: string) =>
  num ? Number(num).toLocaleString('pt-BR') : 'N/A';

/* ---------- Mapa de ID → nome de categoria ---------- */
const categories: Record<string, string> = {
  '1': 'Filmes e Animação',
  '2': 'Autos e Veículos',
  '10': 'Música',
  '15': 'Pets e Animais',
  '17': 'Esportes',
  '20': 'Jogos',
  '22': 'Pessoas e Blogs',
  '23': 'Comédia',
  '24': 'Entretenimento',
  '25': 'Notícias e Política',
  '26': 'Como Fazer e Estilo',
  '27': 'Educação',
  '28': 'Ciência e Tecnologia',
  '29': 'ONGs e Ativismo Social',
};

export default function YouTubeSEOChecklist() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const extractVideoId = (url: string) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)(?:\/(?:watch\?v=|embed\/|shorts\/)?)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const checkField = (field?: string | string[]) =>
    field && (Array.isArray(field) ? field.length : field.trim().length) > 0
      ? '✅'
      : '❌';

  /* ---------- Busca dados do vídeo ---------- */
  const fetchVideoData = async () => {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      setStatus('⚠️ URL inválida. Cole uma URL de vídeo válida.');
      setVideoData(null);
      return;
    }

    setLoading(true);
    setStatus('🔍 Buscando informações…');
    setVideoData(null);

    try {
      const res = await fetch(`/api/checklist?v=${videoId}`);
      const data = await res.json();

      if (data.error) {
        setStatus(`❌ ${data.error}`);
        return;
      }

      setVideoData(data as VideoData);
      setStatus('✅ Dados carregados com sucesso!');
    } catch (error) {
      console.error(error);
      setStatus('❌ Erro ao buscar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Testa se há miniatura customizada ---------- */
  const isCustomThumbnail = Boolean(
    videoData?.thumbnails?.maxres || videoData?.thumbnails?.standard
  );

  return (
    <main className="min-h-screen p-6 bg-white text-black overflow-x-hidden">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-xl sm:text-3xl font-bold text-center">
          🎯 Checklist SEO para vídeos do YouTube
        </h1>
        <p className="text-center text-gray-600">
          Será que você esqueceu de preencher um campo importante? Vamos descobrir!
        </p>

        {/* Formulário */}
        <section className="w-full bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Analisar vídeo</h2>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Cole a URL do vídeo aqui"
              className="flex-grow p-3 border border-gray-300 rounded-md"
            />
            <button
              onClick={fetchVideoData}
              disabled={loading}
              className="px-6 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full sm:w-auto"
            >
              {loading ? 'Carregando…' : 'Verificar'}
            </button>
          </div>

          {status && <p className="mt-3 text-sm text-gray-700">{status}</p>}
        </section>

        {/* Tabela e métricas */}
        {videoData && (
          <>
            <h2 className="text-xl font-semibold mt-8 mb-2 text-center">
              📊 Checklist de SEO no YouTube Studio
            </h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              Com notas de importância para SEO (de 1 a 5 ⭐)
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Item</th>
                    <th className="border border-gray-300 p-2 text-center">Importância</th>
                    <th className="border border-gray-300 p-2 text-center">Preenchido</th>
                    <th className="border border-gray-300 p-2 text-left hidden sm:table-cell">
                      Observação
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Título</td>
                    <td className="border p-2 text-center">⭐⭐⭐⭐⭐</td>
                    <td className="border p-2 text-center">{checkField(videoData.title)}</td>
                    <td className="border p-2 hidden sm:table-cell">Fundamental para ranqueamento</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Descrição</td>
                    <td className="border p-2 text-center">⭐⭐⭐⭐⭐</td>
                    <td className="border p-2 text-center">{checkField(videoData.description)}</td>
                    <td className="border p-2 hidden sm:table-cell">Importante para engajamento</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Thumbnail personalizada</td>
                    <td className="border p-2 text-center">⭐⭐⭐</td>
                    <td className="border p-2 text-center">{isCustomThumbnail ? '✅' : '❌'}</td>
                    <td className="border p-2 hidden sm:table-cell">
                      {isCustomThumbnail
                        ? 'Boa! Você enviou uma miniatura customizada.'
                        : 'Use uma imagem customizada para atrair mais cliques.'}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">Tags</td>
                    <td className="border p-2 text-center">⭐⭐⭐</td>
                    <td className="border p-2 text-center">{checkField(videoData.tags)}</td>
                    <td className="border p-2 hidden sm:table-cell">Melhora descoberta do vídeo</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Categoria</td>
                    <td className="border p-2 text-center">⭐⭐</td>
                    <td className="border p-2 text-center">{checkField(videoData.categoryId)}</td>
                    <td className="border p-2 hidden sm:table-cell">
                      {categories[videoData.categoryId || ''] || 'Categoria não definida'}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">Idioma do vídeo</td>
                    <td className="border p-2 text-center">⭐⭐</td>
                    <td className="border p-2 text-center">{checkField(videoData.defaultAudioLanguage)}</td>
                    <td className="border p-2 hidden sm:table-cell">Segmenta público corretamente</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Painel de métricas */}
            <section className="mt-8 bg-white border border-gray-300 rounded-lg shadow-sm p-6 space-y-4">
              <h1 className="text-2xl font-bold text-center">{videoData.title}</h1>

              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700 text-center">
                <p>
                  <strong>👁️ Visualizações:</strong> {formatNumber(videoData.viewCount)}
                </p>
                <p>
                  <strong>👍 Likes:</strong> {formatNumber(videoData.likeCount)}
                </p>
                <p>
                  <strong>💬 Comentários:</strong> {formatNumber(videoData.commentCount)}
                </p>
                <p>
                  <strong>📈 Engajamento:</strong>{' '}
                  {videoData.viewCount && videoData.likeCount && videoData.commentCount
                    ? `${(
                        ((Number(videoData.likeCount) + Number(videoData.commentCount)) /
                          Number(videoData.viewCount)) *
                        100
                      ).toFixed(2)}%`
                    : 'N/A'}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">📝 Descrição do vídeo</h2>
                <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                  {videoData.description || 'Sem descrição disponível.'}
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
