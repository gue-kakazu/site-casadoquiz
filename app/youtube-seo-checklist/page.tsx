'use client'

import { useState } from 'react'

/* ---------- Tipo dos dados do vídeo ---------- */
interface VideoData {
  title: string
  description: string
  tags?: string[]
  categoryId?: string
  defaultAudioLanguage?: string
  duration?: string
  viewCount?: string
  likeCount?: string
  commentCount?: string
}

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
}

export const metadata = {
  title: 'Checklist SEO para vídeos do YouTube',
  description: 'Verifique se seu vídeo está otimizado para o YouTube Studio com nosso checklist de SEO.',
}


export default function YouTubeSEOChecklist() {
  const [videoUrl, setVideoUrl] = useState('')
  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  /* ---------- Extrai o ID do vídeo em QUALQUER formato ---------- */
  const extractVideoId = (url: string) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)(?:\/(?:watch\?v=|embed\/|shorts\/)?)([a-zA-Z0-9_-]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  /* ---------- Retorna ✅ ou ❌ ---------- */
  const checkField = (field?: string | string[]) =>
    field && (Array.isArray(field) ? field.length : field.trim().length) > 0 ? '✅' : '❌'

  /* ---------- Busca dados do vídeo ---------- */
  const fetchVideoData = async () => {
    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
      setStatus('⚠️ URL inválida. Cole uma URL de vídeo válida.')
      setVideoData(null)
      return
    }

    setLoading(true)
    setStatus('🔍 Buscando informações…')
    setVideoData(null)

    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      )
      const data = await res.json()

      if (data.items && data.items.length > 0) {
        const item = data.items[0]
        const { title, description, tags, categoryId, defaultAudioLanguage } = item.snippet
        const { duration } = item.contentDetails
        const { viewCount, likeCount, commentCount } = item.statistics

        setVideoData({
          title,
          description,
          tags,
          categoryId,
          defaultAudioLanguage,
          duration,
          viewCount,
          likeCount,
          commentCount,
        })
        setStatus('✅ Dados carregados com sucesso!')
      } else {
        setStatus('⚠️ Nenhum vídeo encontrado com esse ID.')
      }
    } catch (error) {
      console.error(error)
      setStatus('❌ Erro ao buscar dados. Verifique a chave da API ou tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-6 bg-white text-black">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <h1 className="text-3xl font-bold text-center">
          🎯 Checklist SEO para vídeos do YouTube
        </h1>
        <p className="text-center text-gray-600">
          Será que você esqueceu de preencher um campo importante? Vamos descobrir!
        </p>

        {/* Painel de análise */}
        <section className="w-full bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Analisar vídeo</h2>

          <div className="flex gap-2">
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
              className="px-6 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {loading ? 'Carregando…' : 'Verificar'}
            </button>
          </div>

          {status && <p className="mt-3 text-sm text-gray-700">{status}</p>}
        </section>

        {/* Resultado */}
        {videoData && (
          <>
            <h2 className="text-xl font-semibold mt-8 mb-2 text-center">
              📊 Checklist de SEO no YouTube Studio
            </h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              Com notas de importância para SEO (de 1 a 5 ⭐)
            </p>

            {/* Tabela de preenchimento */}
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Item</th>
                  <th className="border border-gray-300 p-2 text-center">Importância</th>
                  <th className="border border-gray-300 p-2 text-center">Preenchido</th>
                  <th className="border border-gray-300 p-2 text-left">Observação</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">Título</td>
                  <td className="border border-gray-300 p-2 text-center">⭐⭐⭐⭐⭐</td>
                  <td className="border border-gray-300 p-2 text-center">
                    {checkField(videoData.title)}
                  </td>
                  <td className="border border-gray-300 p-2">Fundamental para ranqueamento</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Descrição</td>
                  <td className="border border-gray-300 p-2 text-center">⭐⭐⭐⭐⭐</td>
                  <td className="border border-gray-300 p-2 text-center">
                    {checkField(videoData.description)}
                  </td>
                  <td className="border border-gray-300 p-2">Importante para engajamento</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Tags</td>
                  <td className="border border-gray-300 p-2 text-center">⭐⭐⭐</td>
                  <td className="border border-gray-300 p-2 text-center">
                    {checkField(videoData.tags)}
                  </td>
                  <td className="border border-gray-300 p-2">Melhora descoberta do vídeo</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Categoria</td>
                  <td className="border border-gray-300 p-2 text-center">⭐⭐</td>
                  <td className="border border-gray-300 p-2 text-center">
                    {checkField(videoData.categoryId)}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {categories[videoData.categoryId || ''] || 'Categoria não definida'}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Idioma do vídeo</td>
                  <td className="border border-gray-300 p-2 text-center">⭐⭐</td>
                  <td className="border border-gray-300 p-2 text-center">
                    {checkField(videoData.defaultAudioLanguage)}
                  </td>
                  <td className="border border-gray-300 p-2">Segmenta público corretamente</td>
                </tr>
              </tbody>
            </table>

            {/* Painel de métricas */}
            <section className="mt-8 bg-white border border-gray-300 rounded-lg shadow-sm p-6 space-y-4">
              <h1 className="text-2xl font-bold text-center">{videoData.title}</h1>

              <div className="flex flex-col sm:flex-row sm:justify-center sm:gap-8 text-sm text-gray-700 text-center">
                <p>
                  <strong>👁️ Visualizações:</strong> {videoData.viewCount || 'N/A'}
                </p>
                <p>
                  <strong>👍 Likes:</strong> {videoData.likeCount || 'N/A'}
                </p>
                <p>
                  <strong>💬 Comentários:</strong> {videoData.commentCount || 'N/A'}
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
                <h2 className="text-lg font-semibold mb-2">
                  📝 Descrição do vídeo
                </h2>
                <p className="text-sm text-gray-800 whitespace-pre-line">
                  {videoData.description || 'Sem descrição disponível.'}
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  )
}
