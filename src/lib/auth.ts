import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { customSession, magicLink } from 'better-auth/plugins'
import { Resend } from 'resend'
import { db } from '#/db'
import { env } from './env'
import * as schema from '#/db/schema.ts'
import { eq } from 'drizzle-orm'
const resend = new Resend(env.RESEND_API_KEY)

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    }
  }),
  baseURL: env.BASE_URL,
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        console.log('b');

        if (!env.RESEND_API_KEY || env.RESEND_API_KEY === 're_123456789') {
          console.log(`Magic link for ${email}: ${url}`)
          return
        }
        const a = await resend.emails.send({
          from: 'login@syncmate.xyz',
          to: email,
          subject: 'Sign in to Inboxly',
          html: `<p>Click the link below to sign in to your account:</p><p><a href="${url}">${url}</a></p>`,
        })
        console.log(a);

      },
    }),
    customSession(async ({ user, session }) => {
      try {
        const userWithRole = await db.select().from(schema.user).where(eq(schema.user.id, user.id))

        return {
          user: {
            ...user,
            dmPrice: userWithRole?.[0]?.dmPrice,
            guaranteedReplyPrice: userWithRole?.[0]?.guaranteedReplyPrice
          },
          session
        };
      } catch (error) {
        console.error("Failed to get user details", error)
        throw error
      }
    }),],
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
})
