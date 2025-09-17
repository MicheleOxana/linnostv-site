import Head from 'next/head'
import AnimatedBackground from '../components/AnimatedBackground'
import Nav from '../components/Nav'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const TWITCH_CHANNEL = 'linnostv'

const YT_CHANNEL_ID = process.env.NEXT_PUBLIC_YT_CHANNEL_ID || ''

type YtVideo = { id: string; title: string; url: string; thumb: string; published: string }

type Highlight = { sub: string; bits: string; follow: string }

export default function Sobre() {
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
      setBenefIndex(i => (i + 3) % beneficiosSubs.length)
    }, 7000)
    return () => clearInterval(id)
  }, [beneficiosSubs.length])

  const visibleBenefits = [0, 1, 2].map(
    n => beneficiosSubs[(benefIndex + n) % beneficiosSubs.length]
  )
  // ----------------------------------------------------------------

  // ----------------- YOUTUBE (últimos 3) -----------------
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

  const Section: React.FC<{ title: string; emoji?: string; children: React.ReactNode }>
    = ({ title, emoji, children }) => (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-6 p-4 md:p-5 rounded-xl border border-white/10 bg-black/40 shadow-[0_0_12px_rgba(255,255,255,0.08)]"
      >
        <h2 className="text-xl md:text-2xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-indigo-400 to-fuchsia-400">
          {emoji ? `${emoji} ` : ''}{title}
        </h2>
        <div className="text-sm md:text-base text-white/90 leading-relaxed">
          {children}
        </div>
      </motion.section>
    )

  return (
    <>
      <Head>
        <title>Sobre — LinnosTV</title>
        <meta name="description" content="Quem é o LinnosTV? História, games, fandom e missão." />
      </Head>

      <AnimatedBackground />
      <div className="min-h-screen text-white flex flex-col font-sans relative overflow-hidden">
        <Nav />

        {/* LAYOUT IGUAL À HOME: aside esquerdo / conteúdo central / aside direito */}
        <div className="flex flex-1 z-10 px-4 md:px-6 py-4">
          {/* aside esquerdo (Pix + Benefícios + YouTube) */}
          <aside className="w-48 bg-black/40 p-4 border border-white/10 border-r-0 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">✨Apoie o rolê✨</h3>

            {/* Título "Doe no Pix" com shimmer */}
            <div className="text-center mb-2">
              <span
                className="block text-base font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-indigo-400 to-fuchsia-400 animate-shimmer"
              >
                Doe no Pix
              </span>
            </div>

            {/* QR Code */}
            <div className="relative">
              <img
                src="/pix-qr.png"
                alt="QR Code Pix — Doe no Pix"
                className="w-full h-auto rounded-md border border-white/10 shadow-[0_0_12px_rgba(255,255,255,0.12)]"
              />
              <span className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-white/10" />
            </div>

            <div className="mt-3 text-[11px] text-center text-white/70">Obrigado pelo apoio, gatinho(a)</div>
            <div className="mt-0 text-[20px] text-center text-white/70">💜</div>

            {/* Benefícios de SUBS (3 por vez) */}
            <div className="mt-3">
              <div className="text-center text-sm font-bold text-white/90">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-pink-400 to-purple-400 animate-shimmer">✨ Benefícios de SUBS</span>
              </div>

              <div className="mt-5 relative min-h-[4.5rem]">
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

            {/* YouTube – últimos 3 */}
            <div className="mt-5">
              <div className="text-center text-sm font-bold text-white/90">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-rose-400 to-pink-400 animate-shimmer">▶️ Últimos do YouTube</span>
              </div>

              <div className="mt-1 space-y-1">
                {ytError ? (
                  <div className="text-xs text-white/60 text-center">{ytError}</div>
                ) : ytVideos.length === 0 ? (
                  <div className="text-xs text-white/60 text-center">Carregando…</div>
                ) : (
                  ytVideos.map(v => (
                    <a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer" className="block group">
                      <div className="relative w-full aspect-video rounded-md overflow-hidden border border-white/10">
                        <img src={v.thumb} alt={v.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
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
              @keyframes shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
              .animate-shimmer { background-size: 200% 100%; animation: shimmer 3.2s linear infinite; }
            `}</style>
          </aside>

          {/* CONTEÚDO CENTRAL */}
          <main className="flex-1 relative bg-black/30 rounded-lg border border-white/10 mx-4 p-4 md:p-6 overflow-y-auto">
            {/* Intro / Quem sou eu */}
            <Section title="Quem sou eu?" emoji="🎮">
              <p className="mb-3">
                Fala, galera! Eu sou o <strong>Thiago</strong> — mas por aqui você pode me chamar de <strong>Linnostv</strong>.
                Sou de <strong>São Paulo-SP</strong> e estou nessa jornada de lives há <strong>mais de 4 anos</strong>.
              </p>
              <p className="mb-3">
                Tudo começou de um jeito bem roots: usei o dinheiro da rescisão para montar meu primeiro PC e comprar meus periféricos. A real é que
                câmera, teclado, mouse e monitor foram todos usados ou de segunda mão, mas serviram de combustível para começar. Hoje, graças a Deus e à nossa comunidade incrível,
                conseguimos modernizar o setup e até montar um cenário feito com muito carinho. 🖤
              </p>
              <p>
                Essa comunidade tem nome e sobrenome: <strong>Felinnos</strong>. Uma família que cresce com os pés no chão, entre gameplays “criminosas”, momentos divertidos e risadas garantidas.
              </p>
            </Section>

            {/* Onde me encontrar */}
            <Section title="Onde me encontrar?" emoji="📡">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <a href={`https://www.twitch.tv/${TWITCH_CHANNEL}`} target="_blank" rel="noreferrer" className="group p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition">
                  <div className="text-lg font-bold">🔴 Lives</div>
                  <div className="text-white/80 text-sm">Twitch & Kick</div>
                </a>
                <a href="https://www.tiktok.com/@linnostv" target="_blank" rel="noreferrer" className="group p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition">
                  <div className="text-lg font-bold">🎬 Vídeos curtos</div>
                  <div className="text-white/80 text-sm">TikTok</div>
                </a>
                <a href="https://www.youtube.com/@linnostv" target="_blank" rel="noreferrer" className="group p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition">
                  <div className="text-lg font-bold">🎥 Vídeos longos</div>
                  <div className="text-white/80 text-sm">YouTube</div>
                </a>
              </div>
              <p className="mt-3 text-white/90">
                Meu foco? Trazer boas vibes e bons momentos para quem assiste, sempre com aquela energia que mistura anime, cultura geek e games.
              </p>
            </Section>

            {/* Games do momento */}
            <Section title="Games do momento" emoji="🕹️">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <li className="flex items-center gap-2"><span>⚔️</span> <span>League of Legends</span></li>
                <li className="flex items-center gap-2"><span>🔫</span> <span>Valorant</span></li>
                <li className="flex items-center gap-2"><span>🌀</span> <span>Hollow Knight: Silksong</span></li>
                <li className="flex items-center gap-2"><span>🐉</span> <span>Dragon Ball Gekishin Squadra</span></li>
                <li className="flex items-center gap-2"><span>🌍</span> <span>Albion Online</span></li>
              </ul>
            </Section>

            {/* Representatividade */}
            <Section title="Representatividade importa" emoji="✊">
              <p>
                Quando comecei a assistir lives, eu sentia falta de representatividade. Quase não existiam streamers pretos com grande visibilidade, e isso sempre ficou na minha cabeça.
                Sendo preto e parte da comunidade LGBT, quero ajudar a mudar esse cenário. Mesmo que meu conteúdo não seja diretamente político, estar em lugares de visibilidade já é um ato político — principalmente para as crianças e pessoas que procuram referências como nós.
              </p>
            </Section>

            {/* Fandom Zone */}
            <Section title="Fandom Zone" emoji="💥">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold text-white/95 mb-2">📺 Animes favoritos</h3>
                  <ul className="space-y-1">
                    <li>Hunter x Hunter</li>
                    <li>Yu Yu Hakusho</li>
                    <li>Cavaleiros dos Zodíaco</li>
                    <li>Dragon Ball Z</li>
                    <li>Bleach</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-white/95 mb-2">🍿 Filmes & Séries</h3>
                  <p>Sou bem variado, mas minhas paixões são ficção, magia, fantasia e suspense.</p>
                </div>
              </div>
            </Section>

            {/* Missão */}
            <Section title="Missão" emoji="🚀">
              <p>
                Construir um espaço divertido, acolhedor e cheio de energia para quem cola nas lives, criando memórias e mostrando que todos nós temos lugar no mundo geek e gamer.
              </p>
            </Section>
          </main>

          {/* aside direito: Links rápidos / redes */}
          <aside className="w-[25%] min-w-[300px] max-w-[400px] bg-black/40 border border-white/10 rounded-lg relative flex flex-col p-3">
            <div className="text-center text-white/80 py-2 border-b border-white/10 font-bold text-sm bg-white/5 rounded-md">😻 Links Felinnos 😻</div>
            <div className="mt-3 grid grid-cols-1 gap-2">
              <a href={`https://www.twitch.tv/${TWITCH_CHANNEL}`} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition">Twitch</a>
              <a href="https://kick.com/linnostv" target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition">Kick</a>
              <a href="https://www.tiktok.com/@linnostv" target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition">TikTok</a>
              <a href="https://www.youtube.com/@linnostv" target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition">YouTube</a>
              <a href="https://discord.gg/" target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition">Discord</a>
              <a href="https://twitter.com/" target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition">Twitter/X</a>
            </div>

            <div className="mt-4 p-3 rounded-lg border border-white/10 bg-white/5">
              <div className="text-sm font-bold mb-1">💌 Contato</div>
              <div className="text-sm text-white/80">Parcerias: <span className="font-semibold">contato@linnostv.live</span></div>
            </div>
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
            className="font-extrabold bg-gradient-to-r from-fuchsia-400 via-pink-400 to-purple-400 bg-clip-text text-transparent underline underline-offset-4 decoration-2 hover:opacity-90"
          >
            Michele Oxana
          </a>
        </footer>
      </div>
    </>
  )
}
