// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || ''
  if (host === 'linnostv.live') {
    return NextResponse.redirect(new URL(`https://www.linnostv.live${req.nextUrl.pathname}${req.nextUrl.search}`))
  }
  return NextResponse.next()
}
export const config = { matcher: '/:path*' }
