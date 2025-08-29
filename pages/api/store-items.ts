import type { NextApiRequest, NextApiResponse } from 'next'
import { storeItems } from '../../data/storeItems'

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(storeItems)
}
