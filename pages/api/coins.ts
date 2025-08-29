import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { adminDb } from '../../lib/firebaseAdmin'

type Data = { coins: number; name?: string; image?: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | { error: string }>) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Not authenticated' })

  const uid = (session as any).twitchId as string
  const name = session.user?.name || ''
  const image = session.user?.image || ''

  const ref = adminDb.collection('users').doc(uid)
  const snap = await ref.get()

  if (!snap.exists) {
    await ref.set({ coins: 0, name, image }, { merge: true })
    return res.status(200).json({ coins: 0, name, image })
  }
  const data = snap.data() || {}
  return res.status(200).json({
    coins: typeof data.coins === 'number' ? data.coins : 0,
    name: data.name || name,
    image: data.image || image
  })
}
