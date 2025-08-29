import NextAuth, { type NextAuthOptions } from 'next-auth'
import TwitchProvider from 'next-auth/providers/twitch'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.twitchId = (profile as any).id
        token.picture = (profile as any).profile_image_url || token.picture
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        (session as any).twitchId = token.twitchId
        if (token.picture) session.user!.image = token.picture as string
      }
      return session
    }
  }
}

export default NextAuth(authOptions)
