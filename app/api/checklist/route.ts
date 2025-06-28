// app/api/checklist/route.ts
import { NextResponse } from 'next/server';

/**
 * GET /api/checklist?v={VIDEO_ID}
 * Devolve snippet + statistics para o Checklist SEO.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('v');          // ?v=XXXXXXXXXXX
  if (!videoId) {
    return NextResponse.json(
      { error: 'Parâmetro v (videoId) é obrigatório' },
      { status: 400 }
    );
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'YOUTUBE_API_KEY não configurada' },
      { status: 500 }
    );
  }

  try {
    // --- Chamada à YouTube Data API ---
    const yt = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`
    ).then(r => r.json());

    const item = yt.items?.[0];
    if (!item) {
      return NextResponse.json(
        { error: 'Vídeo não encontrado' },
        { status: 404 }
      );
    }

    // --- Resposta enxuta para o front ---
    return NextResponse.json({
      title: item.snippet.title,
      description: item.snippet.description,
      tags: item.snippet.tags,
      categoryId: item.snippet.categoryId,
      defaultAudioLanguage: item.snippet.defaultAudioLanguage,
      duration: item.contentDetails.duration,     // ISO 8601
      viewCount: item.statistics.viewCount,
      likeCount: item.statistics.likeCount,
      commentCount: item.statistics.commentCount,
      thumbnails: item.snippet.thumbnails,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Erro interno' },
      { status: 500 }
    );
  }
}
