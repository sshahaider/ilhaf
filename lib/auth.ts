import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import { headers } from 'next/headers';
import { domain, siteLink, siteName } from '@/config';
import { admin, emailOTP } from 'better-auth/plugins';
import { user, session, account, verification } from '@/db/schema';
import { redirect } from 'next/navigation';
import { sendVerificationOTPAction } from './mail';

function getAuthBaseURL() {
	const envUrl = process.env.BETTER_AUTH_URL?.trim();
	if (envUrl && !envUrl.includes('localhost')) return envUrl;
	if (process.env.NODE_ENV === 'production') return siteLink;
	return envUrl || 'http://localhost:3000';
}

export const auth = betterAuth({
	baseURL: getAuthBaseURL(),
	trustedOrigins: [siteLink, `https://www.${domain}`],
	plugins: [
		admin(),
		emailOTP({
			sendVerificationOnSignUp: true,
			sendVerificationOTP: sendVerificationOTPAction,
		}),
	],
	advanced: {
		cookiePrefix: siteName,
		trustedProxyHeaders: true,
	},
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: {
			user,
			session,
			account,
			verification,
		},
	}),
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
	},
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 24 * 60 * 60, // 24 hours in seconds
		},
	},
});

export async function getCurrentUser() {
	const headersList = await headers();
	const session = await auth.api.getSession({
		headers: headersList,
	});
	return session?.user;
}

export async function confirmUser() {
	const user = await getCurrentUser();
	if (!user) {
		return redirect('/auth');
	}
	return user;
}

export type SessionUser = Awaited<ReturnType<typeof getCurrentUser>>;
