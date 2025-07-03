import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { database } from '@/database/index.ts';
import { env } from '@/lib/env.ts';
import { admin, openAPI } from 'better-auth/plugins';
import { sendResetPasswordEmail, sendVerificationEmail } from '@/lib/email.ts';

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: env.NODE_ENV === 'production',
        sendResetPassword: async ({ user, url }) => {
            await sendResetPasswordEmail(user.email, url);
        },
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            await sendVerificationEmail(user.email, url);
        },
    },
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
        twitter: {
            clientId: env.TWITTER_CLIENT_ID,
            clientSecret: env.TWITTER_CLIENT_SECRET,
        },
    },
    advanced: {
        crossSubDomainCookies: {
            enabled: env.NODE_ENV === 'production',
            domain: `.${env.BACKEND_DOMAIN}`, // Domain with a leading period
        },
        defaultCookieAttributes: {
            secure: true,
            httpOnly: true,
            sameSite: 'none',  // Allows CORS-based cookie sharing across subdomains
            partitioned: true, // New browser standards will mandate this for foreign cookies
        },
    },
    database: drizzleAdapter(database, {
        provider: 'pg',
        usePlural: true,
    }),
    trustedOrigins: env.ALLOWED_ORIGINS,
    basePath: '/auth',
    plugins: [
        admin(),
        openAPI(),
    ],
   
});
