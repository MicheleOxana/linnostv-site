import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import TwitchProvider from 'next-auth/providers/twitch'

export const authOptions: NextAuthOptions = {
  // logs na Vercel para ver qualquer problema real
  debug: true,

  // PRECISA estar definido na Vercel/Production
  secret: process.env.NEXTAUTH_SECRET,

  // JWT no cookie (padrão)
  session: { strategy: 'jwt' },

  // NextAuth deduz cookies "Secure" a partir do NEXTAUTH_URL=https://...
  // portanto não precisamos de cookies custom

  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'user:read:email chat:read chat:edit',
          force_verify: true,
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken  = account.access_token as string | undefined
        token.refreshToken = account.refresh_token as string | undefined
      }
      if (profile) {
        token.twitchId = (profile as any).id
        token.picture  = (profile as any).profile_image_url || token.picture
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        const s = session as any
        s.twitchId    = token.twitchId ?? null
        s.accessToken = token.accessToken ?? null
        if (token.picture && session.user) session.user.image = token.picture as string
      }
      return session
    },

    // sempre garanta retorno ao seu domínio base
    async redirect({ url, baseUrl }) {
      try { const u = new URL(url); if (u.origin === baseUrl) return url } catch {}
      return baseUrl
    },
  },
}

export default NextAuth(authOptions)
