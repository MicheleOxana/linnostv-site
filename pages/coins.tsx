import Head from 'next/head'
import Nav from '../components/Nav'
import Card from '../components/Card'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

type CoinsData = {
  coins: number
  name?: string
  image?: string
}

export default function CoinsPage() {
  const { data: session, status } = useSession()
  const [data, setData] = useState<CoinsData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      setLoading(true)
      fetch('/api/coins')
        .then(r => r.json())
        .then(setData)
        .finally(() => setLoading(false))
    }
  }, [status])

  return (
    <>
      <Head><title>Fellinos Coins — LinnosTV</title></Head>
      <Nav />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-black grad-text">Fellinos Coins</h1>
        {status !== 'authenticated' && (
          <Card><p>Faça login com sua conta Twitch para ver seu saldo e histórico.</p></Card>
        )}
        {status === 'authenticated' && (
          <>
            <Card>
              {loading && <p>Carregando...</p>}
              {!loading && data && (
                <div className="flex items-center gap-4">
                  {data.image && <img src={data.image} alt="avatar" className="w-12 h-12 rounded-full" />}
                  <div>
                    <div className="text-white/80">Usuário</div>
                    <div className="text-xl font-bold">{data.name}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-white/80">Saldo</div>
                    <div className="text-3xl font-black">{data.coins.toLocaleString()} 🐾</div>
                  </div>
                </div>
              )}
            </Card>
          </>
        )}
      </main>
      <div className="sparkle" />
    </>
  )
}
