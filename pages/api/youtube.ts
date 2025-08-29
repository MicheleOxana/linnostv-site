import type { NextApiRequest, NextApiResponse } from 'next'

type YtVideo = { id: string; title: string; url: string; published: string; thumb: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const channelId = String(req.query.channelId || '')
  const max = Math.min(parseInt(String(req.query.max || '5'), 10) || 5, 10)

  if (!channelId) {
    return res.status(400).json({ error: 'channelId is required' })
  }

  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`
  try {
    const r = await fetch(feedUrl)
    if (!r.ok) throw new Error(`Failed to fetch feed: ${r.status}`)
    const xml = await r.text()

    // Parse simples do XML (sem dependências)
    const entries = xml.split('<entry>').slice(1).map(e => e.split('</entry>')[0])
    const videos: YtVideo[] = []

    for (const e of entries.slice(0, max)) {
      const id = matchTag(e, 'yt:videoId')
      const title = decode(matchTag(e, 'title'))
      const linkMatch = e.match(/<link[^>]+href="([^"]+)"/)
      const url = linkMatch ? linkMatch[1] : `https://www.youtube.com/watch?v=${id}`
      const published = matchTag(e, 'published')
      const thumb = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : ''

      if (id) videos.push({ id, title, url, published, thumb })
    }

    res.status(200).json({ videos })
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'unknown error' })
  }
}

function matchTag(s: string, tag: string): string {
  const m = s.match(new RegExp(`<${escapeRegExp(tag)}>([\\s\\S]*?)</${escapeRegExp(tag)}>`, 'i'))
  return m ? m[1] : ''
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function decode(s: string) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}
