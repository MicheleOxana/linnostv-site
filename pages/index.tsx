import Head from 'next/head'
import AnimatedBackground from '../components/AnimatedBackground'
import Nav from '../components/Nav'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'

const TWITCH_CHANNEL = 'linnostv'

const parents = (
  process.env.NEXT_PUBLIC_TWITCH_PARENTS ||
  process.env.NEXT_PUBLIC_TWITCH_PARENT || // fallback, se você já usava
  'linnostv.live'
)
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

const parentParams = parents.map(p => `parent=${encodeURIComponent(p)}`).join('&')

const YT_CHANNEL_ID = process.env.NEXT_PUBLIC_YT_CHANNEL_ID || ''

type YtVideo = { id: string; title: string; url: string; thumb: string; published: string }

export default function Home() {
  const [tempoLive, setTempoLive] = useState<string>('fora do ar')
  const [viewers, setViewers] = useState<number | 'off'>('off')
  const [highlights, setHighlights] = useState<{ sub: string; bits: string; follow: string }>({
    sub: '',
    bits: '',
    follow: ''
  })

  
  // uptime
  useEffect(() => {
    let clear: ReturnType<typeof setInterval> | undefined
    const run = async () => {
      try {
        const res = await axios.get('/api/uptime')
        if (!res.data?.isLive) {
          setTempoLive('fora do ar')
          return
        }
        const startedAt = new Date(res.data.startedAt)
        clear = setInterval(() => {
          const now = new Date()
          const diff = now.getTime() - startedAt.getTime()
          const h = Math.floor(diff / 36e5)
          const m = Math.floor((diff % 36e5) / 6e4)
          const s = Math.floor((diff % 6e4) / 1000)
          setTempoLive(`${h}h ${m}min ${s}s`)
        }, 1000)
      } catch {
        setTempoLive('fora do ar')
      }
    }
    run()
    return () => clear && clearInterval(clear)
  }, [])

  // viewers
  useEffect(() => {
    const fetchViewers = async () => {
      try {
        const res = await axios.get('/api/viewers')
        setViewers(res.data?.viewers ?? 'off')
      } catch {
        setViewers('off')
      }
    }
    fetchViewers()
    const i = setInterval(fetchViewers, 15000)
    return () => clearInterval(i)
  }, [])

  // highlights (mantido caso use em outros lugares)
  useEffect(() => {
    const fetchHl = async () => {
      try {
        const res = await axios.get('/api/highlights')
        setHighlights(res.data ?? { sub: '', bits: '', follow: '' })
      } catch {}
    }
    fetchHl()
    const i = setInterval(fetchHl, 30000)
    return () => clearInterval(i)
  }, [])

  // ----------------- PIX + BENEFÍCIOS (3 por vez) -----------------
  const beneficiosSubs: readonly string[] = [
    'Farmam o DOBRO de pontos',
    'PRIORIDADE pra jogar',
    'Sorteios EXCLUSIVOS',
    'Cargos e salas EXCLUSIVAS (Discord)',
    'Não assistir anúncios',
    'Emotes exclusivos',
    'Insígnia no nome',
    'Acesso ao grupo dos SUBS',
    'Ser um Felinno eh Bem Gostooosuuu!'
  ] as const

  const [benefIndex, setBenefIndex] = useState<number>(0)

  useEffect(() => {
    const id = setInterval(() => {
      setBenefIndex(i => (i + 3) % beneficiosSubs.length) // avança 3 por vez
    }, 7000) // 7s
    return () => clearInterval(id)
  }, [beneficiosSubs.length])

  // os 3 itens visíveis no "frame" atual
  const visibleBenefits = [0, 1, 2].map(
    n => beneficiosSubs[(benefIndex + n) % beneficiosSubs.length]
  )
  // ----------------------------------------------------------------

    // ----------------- YOUTUBE (últimos 5) -----------------
  const [ytVideos, setYtVideos] = useState<YtVideo[]>([])
  const [ytError, setYtError] = useState<string>('')

  useEffect(() => {
    if (!YT_CHANNEL_ID) {
      setYtError('Configure NEXT_PUBLIC_YT_CHANNEL_ID no .env.local')
      return
    }
    const load = async () => {
      try {
        const r = await fetch(`/api/youtube?channelId=${encodeURIComponent(YT_CHANNEL_ID)}&max=3`)
        const data = await r.json()
        if (data?.videos) setYtVideos(data.videos)
        else setYtError('Não foi possível carregar os vídeos.')
      } catch {
        setYtError('Erro ao carregar os vídeos.')
      }
    }
    load()
  }, [])
  // -------------------------------------------------------

  return (
    <>
      <Head>
        <title>LinnosTV — ao vivo</title>
        <meta name="description" content="LinnosTV ao vivo — LoL, Valorant, animes, reacts e filmes." />
      </Head>

      <AnimatedBackground />
      <div className="min-h-screen text-white flex flex-col font-sans relative overflow-hidden">
        <Nav />

        {/* BLOCO PRINCIPAL NO MESMO TAMANHO DO micheleoxana.live */}
        <div className="flex flex-1 z-10 px-4 md:px-6 py-4">
          {/* aside esquerdo (Pix QR + Obrigado + Benefícios em grupos de 3) */}
          <aside className="w-48 bg-black/40 p-4 border border-white/10 border-r-0 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">✨Apoie o rolê✨</h2>

            {/* Título "Doe no Pix" com shimmer */}
            <div className="text-center mb-2">
              <span
                className="block text-base font-extrabold bg-clip-text text-transparent
                            bg-gradient-to-r from-emerald-400 via-indigo-400 to-fuchsia-400
                            animate-shimmer"
              >
                Doe no Pix
              </span>
            </div>

            {/* QR Code */}
            <div className="relative">
              <img
                src="/pix-qr.png"  // coloque sua imagem em /public/pix-qr.png
                alt="QR Code Pix — Doe no Pix"
                className="w-full h-auto rounded-md border border-white/10 shadow-[0_0_12px_rgba(255,255,255,0.12)]"
              />
              <span className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-white/10" />
            </div>

            {/* Obrigado abaixo do QR */}
            <div className="mt-3 text-[11px] text-center text-white/70">
              Obrigado pelo apoio, gatinho(a)
            </div>
            
                        {/* Obrigado abaixo do QR */}
            <div className="mt0 text-[20px] text-center text-white/70">
              💜
            </div>

            {/* Benefícios de SUBS (3 por vez, rotativo a cada 10s) */}
            <div className="mt-3">
              <div className="text-center text-sm font-bold text-white/90">
                <span
                  className="bg-clip-text text-transparent bg-gradient-to-r
                              from-fuchsia-400 via-pink-400 to-purple-400 animate-shimmer"
                >
                  ✨ Benefícios de SUBS


                </span>
              </div>

              {/* Grupo com 3 itens — anima em cada troca */}
              <div className="mt-5 relative min-h-[4.5rem]">{/* ~3 linhas */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.ul
                    key={benefIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-1 text-[13px] leading-tight"
                  >
                    {visibleBenefits.map((text, i) => (
                      <li key={`${benefIndex}-${i}`} className="flex items-start gap-2 text-white/90">
                        <span className="mt-[2px]">🐾</span>
                        <span>{text}</span>
                      </li>
                    ))}
                  </motion.ul>
                </AnimatePresence>
              </div>
            </div>
            {/* YouTube – últimos 5 */}
            <div className="mt-5">
              <div className="text-center text-sm font-bold text-white/90">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-rose-400 to-pink-400 animate-shimmer">
                  ▶️ Últimos do YouTube
                </span>
              </div>

              <div className="mt-1 space-y-1">
                {ytError ? (
                  <div className="text-xs text-white/60 text-center">{ytError}</div>
                ) : ytVideos.length === 0 ? (
                  <div className="text-xs text-white/60 text-center">Carregando…</div>
                ) : (
                  ytVideos.map(v => (
                    <a
                      key={v.id}
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <div className="relative w-full aspect-video rounded-md overflow-hidden border border-white/10">
                        <img
                          src={v.thumb}
                          alt={v.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-1.5 text-[11px] leading-tight bg-black/60">
                          <span className="line-clamp-2">{v.title}</span>
                        </div>
                      </div>
                    </a>
                  ))
                )}
              </div>
            </div>

            <style jsx>{`
              @keyframes shimmer {
                0% { background-position: 0% 50%; }
                100% { background-position: 200% 50%; }
              }
              .animate-shimmer {
                background-size: 200% 100%;
                animation: shimmer 3.2s linear infinite;
              }
            `}</style>
          </aside>



          {/* player central (82% x 95% como no seu site) */}
          <main className="flex-1 flex justify-center items-center overflow-hidden relative bg-black/30 rounded-lg border border-white/10 mx-4">
            <iframe
               src={`https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&${parentParams}`}
              height="82%"
              width="95%"
              allowFullScreen
              className="rounded-lg shadow-2xl border-4 border-white/10"
            ></iframe>

            {/* uptime */}
            <div className="absolute top-2 right-2 z-40 bg-black/60 text-white px-3 py-1 text-sm rounded-xl shadow-lg border border-white/20">
              ⏰ ao vivo há: {tempoLive}
            </div>

            {/* Lower third do lado direito (vídeo flutuante) */}
<div className="absolute -bottom-4 right-4 z-40">
  <video
    src="/Lowerthirds_VP9.webm"
    autoPlay
    muted
    loop
    playsInline
    className="w-[280px] max-w-[90vw] drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] rounded-md"
  />
</div>

            {/* viewers + ações (mesma posição) */}
            <div className="absolute bottom-2 left-4 z-40 flex gap-4">
              <div className="bg-black/60 text-white px-3 py-1 text-sm rounded-xl border border-white/20">
                {viewers === 'off' ? '🚫 Live fora do ar': `🐱 ${viewers} gatinhos assistindo`}
              </div>

              <a
                href={`https://www.twitch.tv/${TWITCH_CHANNEL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/60 text-white px-3 py-1 text-sm rounded-xl shadow-lg border border-green-400 hover:bg-white/10 transition"
              >
                😸 seguir
              </a>

              <a
                href={`https://www.twitch.tv/subs/linnostv`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/60 text-white px-3 py-1 text-sm rounded-xl shadow-lg border border-yellow-400 hover:bg-white/10 transition"
              >
                🐾 dar sub
              </a>
            </div>
          </main>

          {/* chat à direita (25% / 300–400px como no seu) */}
          <aside className="w-[25%] min-w-[300px] max-w-[400px] bg-black/40 border border-white/10 rounded-lg relative flex flex-col">
            <div className="text-center text-white/80 py-2 border-b border-white/10 font-bold text-sm bg-white/5">
              😻 Papo Felinno 😻
            </div>
            <iframe
              src={`https://www.twitch.tv/embed/${TWITCH_CHANNEL}/chat?${parentParams}`}
              height="100%"
              width="100%"
              className="flex-1"
            ></iframe>
          </aside>
        </div>

        {/* rodapé */}
<footer className="z-10 text-white/70 text-xs sm:text-sm text-center py-4 border-t border-white/10">
  © {new Date().getFullYear()} <span className="font-semibold text-white">LinnosTV</span> — powered by{' '}
  <a
    href="https://micheleoxana.live"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Abrir micheleoxana.live"
    className="font-extrabold bg-gradient-to-r from-fuchsia-400 via-pink-400 to-purple-400 bg-clip-text text-transparent
               underline underline-offset-4 decoration-2 hover:opacity-90"
  >
    Michele Oxana
  </a>
</footer>
      </div>
    </>
  )
}
