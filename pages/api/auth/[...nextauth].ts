import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import TwitchProvider from 'next-auth/providers/twitch'

export const authOptions: NextAuthOptions = {
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: 'jwt'
  },

  // Define os cookies corretamente para domínio customizado
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
        domain: 'www.linnostv.live' // seu domínio EXATO
      }
    }
  },

  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'user:read:email chat:read chat:edit',
          force_verify: true
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token as string | undefined
        token.refreshToken = account.refresh_token as string | undefined

        const nowSec = Math.floor(Date.now() / 1000)
        const expiresAtSec =
          (typeof account.expires_at === 'number' ? account.expires_at : undefined) ??
          (typeof (account as any).expires_in === 'number'
            ? nowSec + Number((account as any).expires_in)
            : undefined)

        if (expiresAtSec) token.expiresAt = expiresAtSec * 1000
      }

      if (profile) {
        token.twitchId = (profile as any).id
        token.picture = (profile as any).profile_image_url || token.picture
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        const s = session as any
        s.twitchId = token.twitchId ?? null
        s.accessToken = token.accessToken ?? null
        s.expiresAt = token.expiresAt ?? null

        if (token.picture && session.user) {
          session.user.image = token.picture as string
        }
      }
      return session
    }
  }
}

export default NextAuth(authOptions)
