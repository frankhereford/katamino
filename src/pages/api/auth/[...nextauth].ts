import NextAuth, { type NextAuthOptions } from 'next-auth'
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter'

import Auth0Provider from 'next-auth/providers/auth0'
import GitHubProvider from 'next-auth/providers/github'

import { env } from '../../../env/server.mjs'
import { prisma } from '../../../server/db/client'

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session ({ session, user }) {
      if (session.user != null) {
        session.user.id = user.id
      }
      return session
    }
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    Auth0Provider({
      clientId: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
      issuer: env.AUTH0_ISSUER
    }),
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET
    })
  ],
  pages: {
    signIn: '/auth/signin'
  }
}

export default NextAuth(authOptions)
