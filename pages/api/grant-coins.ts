import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { adminDb } from '../../lib/firebaseAdmin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Not authenticated' })

  const secret = process.env.GRANT_SECRET
  if (!secret || req.headers['x-grant-secret'] !== secret) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  const { amount } = req.body as { amount?: number }
  const amt = Number(amount || 0)
  if (!amt) return res.status(400).json({ error: 'Missing amount' })

  const uid = (session as any).twitchId as string
  const userRef = adminDb.collection('users').doc(uid)
  await adminDb.runTransaction(async (trx) => {
    const s = await trx.get(userRef)
    const d = s.data() || {}
    const current = typeof d.coins === 'number' ? d.coins : 0
    trx.set(userRef, { coins: current + amt, name: session.user?.name, image: session.user?.image }, { merge: true })
  })

  const updated = await userRef.get()
  return res.status(200).json({ ok: true, newBalance: updated.data()?.coins || 0 })
}
