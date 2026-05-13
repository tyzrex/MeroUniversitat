import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { db } from '@/lib/db';

export const auth = betterAuth({
	database: prismaAdapter(db, {
		provider: 'postgresql'
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false // Set true in production with email provider
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
		}
	},
	session: {
		expiresIn: 60 * 60 * 24 * 30, // 30 days
		updateAge: 60 * 60 * 24, // Update session every 24h
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60 // 5 min cookie cache
		}
	},
	user: {
		additionalFields: {
			role: {
				type: 'string',
				required: false,
				defaultValue: 'USER',
				input: false
			},
			bio: {
				type: 'string',
				required: false
			},
			isVerified: {
				type: 'boolean',
				required: false,
				defaultValue: false,
				input: false
			}
		}
	},
	trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000']
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
