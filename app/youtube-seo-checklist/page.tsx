'use client'

import { useState } from 'react'

export default function YouTubeSEOChecklist() {
  const [videoUrl, setVideoUrl] = useState('')
  const [videoData, setVideoData] = useState<any>(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    return match ? match[1] : null
  }

  const fetchVideoData = async () => {
    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
      setStatus('⚠️ URL inválida. Cole uma URL do YouTube com "v=" ou "youtu.be/"')
      setVideoData(null)
      return
    }

    setLoading(true)
    setStatus('🔍 Buscando informações...')
    setVideoData(null)

    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      )
      const data = await res.json()

      if (data.items && data.items.length > 0) {
        const item = data.items[0]
        const { title, description, channelTitle, publishedAt, tags } = item.snippet
        const duration = item.contentDetails.duration

        setVideoData({ title, description, channelTitle, publishedAt, tags, duration })
        setStatus('✅ Dados carregados com sucesso!')
      } else {
        setStatus('⚠️ Nenhum vídeo encontrado com esse ID.')
      }
    } catch (err) {
      setStatus('❌ Erro ao buscar dados. Verifique sua chave da API ou tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-6 bg-white text-black">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Checklist SEO para Vídeos do YouTube</h1>

        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full p-3 border border-gray-300 rounded-md"
        />

        <button
          onClick={fetchVideoData}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Carregando...' : 'Verificar SEO'}
        </button>

        {status && <div className="mt-2 text-sm text-gray-700">{status}</div>}

        {videoData && (
          <div className="mt-6 p-4 border border-gray-300 rounded bg-gray-50 space-y-2 text-sm">
            <p><strong>🎬 Título:</strong> {videoData.title}</p>
            <p><strong>📃 Descrição:</strong> {videoData.description.slice(0, 200)}...</p>
            <p><strong>📺 Canal:</strong> {videoData.channelTitle}</p>
            <p><strong>🗓️ Publicado em:</strong> {new Date(videoData.publishedAt).toLocaleDateString()}</p>
            <p><strong>⏱️ Duração:</strong> {videoData.duration}</p>
            <p><strong>🏷️ Tags:</strong> {videoData.tags?.join(', ') || 'Nenhuma'}</p>
          </div>
        )}
      </div>
    </main>
  )
}
