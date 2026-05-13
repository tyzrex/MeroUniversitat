import { NextResponse, type NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

const PROTECTED_PREFIXES = ['/dashboard', '/onboarding'] as const;

const ADMIN_PREFIX = '/admin';

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (pathname.startsWith('/api/auth')) {
		return NextResponse.next();
	}

	const hasCookie = Boolean(getSessionCookie(request));

	for (const prefix of PROTECTED_PREFIXES) {
		if (pathname.startsWith(prefix) && !hasCookie) {
			const url = request.nextUrl.clone();
			url.pathname = '/sign-in';
			url.searchParams.set('callbackUrl', pathname);
			return NextResponse.redirect(url);
		}
	}

	if (pathname.startsWith(ADMIN_PREFIX) && !hasCookie) {
		const url = request.nextUrl.clone();
		url.pathname = '/sign-in';
		url.searchParams.set('callbackUrl', pathname);
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/dashboard/:path*', '/onboarding/:path*', '/admin/:path*']
};
