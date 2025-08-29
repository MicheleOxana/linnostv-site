import Head from 'next/head'
import Nav from '../components/Nav'
import Card from '../components/Card'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import type { StoreItem } from '../data/storeItems'

type CoinsData = { coins: number }

export default function StorePage() {
  const { status } = useSession()
  const [items, setItems] = useState<StoreItem[]>([])
  const [coins, setCoins] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    setItems([])
    fetch('/api/store-items').then(r => r.json()).then(setItems)
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/coins').then(r => r.json()).then((d: CoinsData) => setCoins(d.coins || 0))
    }
  }, [status])

  const handleRedeem = async (itemId: string) => {
    setLoading(true); setMessage('')
    const res = await fetch('/api/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId })
    })
    const data = await res.json()
    if (!res.ok) {
      setMessage(data.error || 'Erro ao resgatar.')
    } else {
      setMessage('Resgate concluído com sucesso!')
      setCoins(data.newBalance || coins)
    }
    setLoading(false)
  }

  return (
    <>
      <Head><title>Loja — LinnosTV</title></Head>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-black grad-text">Loja</h1>

        {status !== 'authenticated' && (
          <Card><p>Faça login com Twitch para resgatar itens com suas Fellinos Coins.</p></Card>
        )}

        {status === 'authenticated' && (
          <Card>
            <div className="flex justify-between items-center">
              <div className="text-white/80">Seu saldo</div>
              <div className="text-2xl font-black">{coins.toLocaleString()} 🐾</div>
            </div>
          </Card>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it) => (
            <Card key={it.id} className="flex flex-col">
              <div className="text-xl font-bold">{it.title}</div>
              <div className="text-white/80 mt-1">{it.description}</div>
              <div className="mt-3 font-bold">{it.cost.toLocaleString()} 🐾</div>
              <button
                disabled={status !== 'authenticated' || loading || coins < it.cost}
                onClick={() => handleRedeem(it.id)}
                className="btn-primary mt-4 disabled:opacity-50"
              >
                Resgatar
              </button>
            </Card>
          ))}
        </div>

        {message && <div className="card p-3">{message}</div>}
      </main>
      <div className="sparkle" />
    </>
  )
}
