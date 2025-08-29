import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { adminDb } from '../../lib/firebaseAdmin'
import { storeItems } from '../../data/storeItems'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Not authenticated' })

  const { itemId } = req.body as { itemId?: string }
  if (!itemId) return res.status(400).json({ error: 'Missing itemId' })

  const item = storeItems.find(i => i.id === itemId)
  if (!item) return res.status(404).json({ error: 'Item não encontrado' })

  const uid = (session as any).twitchId as string
  const userRef = adminDb.collection('users').doc(uid)
  const snap = await userRef.get()
  if (!snap.exists) return res.status(400).json({ error: 'Usuário sem saldo inicial' })
  const data = snap.data() || {}
  const coins = typeof data.coins === 'number' ? data.coins : 0

  if (coins < item.cost) return res.status(400).json({ error: 'Saldo insuficiente' })

  // limit per user check
  if (item.limitPerUser) {
    const q = await adminDb.collection('redemptions')
      .where('uid', '==', uid)
      .where('itemId', '==', item.id)
      .get()
    if (q.size >= item.limitPerUser) {
      return res.status(400).json({ error: 'Limite atingido para este item' })
    }
  }

  // atomic transaction
  await adminDb.runTransaction(async (trx) => {
    const doc = await trx.get(userRef)
    const d = doc.data() || {}
    const current = typeof d.coins === 'number' ? d.coins : 0
    if (current < item.cost) throw new Error('Saldo insuficiente')

    trx.update(userRef, { coins: current - item.cost, name: session.user?.name, image: session.user?.image })
    trx.create(adminDb.collection('redemptions').doc(), {
      uid,
      itemId: item.id,
      itemName: item.title,
      cost: item.cost,
      createdAt: new Date().toISOString()
    })
  })

  const updated = await userRef.get()
  return res.status(200).json({ ok: true, newBalance: updated.data()?.coins || 0 })
}
