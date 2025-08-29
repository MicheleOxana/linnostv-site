import Link from 'next/link'
import Image from 'next/image'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function Nav() {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  return (
    // Paleta do Linnos (escuro translúcido + blur), nav encostando nos cantos
    <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="w-full px-4">
        {/* altura maior pra comportar brand/joia grandes */}
        <div className="h-16 md:h-20 flex items-center justify-between">
          {/* ESQUERDA: brand + joia */}
          <Link href="/" aria-label="LinnosTV Home" className="flex items-center gap-3 sm:gap-4">
            <Image
              src="/joia_para_roleta.png"   // certifique-se de estar em /public
              alt="Insígnia LinnosTV"
              width={48}
              height={48}
              className="w-9 h-9 md:w-11 md:h-11"
              priority
            />
            <span className="font-extrabold leading-none tracking-tight">
              <span className="grad-text text-2xl md:text-3xl">LinnosTV</span>
              <span className="ml-1 text-white/70 align-top text-lg md:text-xl">™</span>
              <span className="ml-2 italic font-semibold text-white/80 text-xl md:text-2xl">Live</span>
            </span>
          </Link>

          {/* DIREITA: menu + login */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Menu (scroll horizontal no mobile pra não quebrar) */}
            <nav
              aria-label="Menu principal"
              className="flex items-center gap-3 md:gap-4 text-sm md:text-base text-white/80 overflow-x-auto whitespace-nowrap"
            >
              <Link href="/" className="hover:text-white transition">Início</Link>
              <Link href="/sobre" className="hover:text-white transition">Sobre</Link>
              <Link href="/comandos" className="hover:text-white transition">Comandos</Link>
              <Link href="/coins" className="hover:text-white transition">Felinnos Coins</Link>
              <Link href="/store" className="hover:text-white transition">Loja</Link>
              <Link href="/indicacoes" className="hover:text-white transition">Indicações</Link>
              <Link href="/parcerias" className="hover:text-white transition">Parcerias</Link>
              <Link href="/lista-de-presentes" className="hover:text-white transition">Lista de Presentes</Link>
              <Link href="/sussurros" className="hover:text-white transition">Sussurros</Link>
            </nav>

            {/* Login original (btn-primary) */}
            {!loading && !session && (
              <button
                onClick={() => signIn('twitch')}
                className="btn-primary text-sm md:text-base px-4 md:px-5 py-2 md:py-2.5"
              >
                Entrar com Twitch
              </button>
            )}

            {/* Quando logado */}
            {!loading && session && (
              <div className="flex items-center gap-2 md:gap-3">
                <span className="hidden sm:inline text-white/80 truncate max-w-[12rem] md:max-w-[16rem] text-sm md:text-base">
                  Olá, {session.user?.name?.split(' ')[0]}
                </span>
                <button
                  onClick={() => signOut()}
                  className="rounded-xl px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base font-semibold bg-white/10 hover:bg-white/20 text-white transition"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

