// app/api/channel/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  if (!q) {
    return NextResponse.json({ error: 'Parâmetro q é obrigatório' }, { status: 400 });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Chave da API não configurada' }, { status: 500 });
  }

  // Resolver o channelId (mesma lógica que você tinha no cliente)
  async function resolveChannelId(input: string) {
    if (input.startsWith('UC') && input.length === 24) return input;

    const urlMatch = input.match(/(?:channel\/)([\w-]{24})/);
    if (urlMatch) return urlMatch[1];

    const handleMatch = input.match(/^@([\w-]{3,})$/);
    if (handleMatch) {
      const q = handleMatch[1];
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${q}&key=${apiKey}`
      );
      const data = await res.json();
      return data.items?.[0]?.snippet?.channelId ?? null;
    }

    return null;
  }

  try {
    const channelId = await resolveChannelId(q);
    if (!channelId) return NextResponse.json({ error: 'Canal não encontrado' }, { status: 404 });

    const res = await fetch(
      `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
    );

    if (!res.ok) return NextResponse.json({ error: 'Erro na API do YouTube' }, { status: 500 });

    const data = await res.json();
    const item = data.items?.[0];
    if (!item) return NextResponse.json({ error: 'Canal não encontrado' }, { status: 404 });

    return NextResponse.json({
      title: item.snippet.title,
      subscribers: item.statistics.subscriberCount,
      views: item.statistics.viewCount,
      videos: item.statistics.videoCount,
      thumbnail: item.snippet.thumbnails?.medium?.url,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
