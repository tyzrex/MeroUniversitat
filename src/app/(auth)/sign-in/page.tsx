import { AuthFormPanel } from '@/modules/auth/components/auth-form-panel';
import { AuthMarketingPanel } from '@/modules/auth/components/auth-marketing-panel';
import { SignInForm } from '@/modules/auth/components/sign-in-form';
import { Suspense } from 'react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Sign in',
	description:
		'Sign in to your MeroUniversität account to track applications and connect with peers.'
};

function SignInFallback() {
	return (
		<div className="flex flex-col gap-6 pt-2">
			<div className="bg-muted h-9 w-2/3 animate-pulse rounded-lg" />
			<div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
			<div className="bg-muted h-11 w-full animate-pulse rounded-lg" />
			<div className="bg-muted h-11 w-full animate-pulse rounded-lg" />
		</div>
	);
}

export default function SignInPage() {
	return (
		<div className="bg-muted/30 flex min-h-screen flex-col lg:flex-row">
			<AuthMarketingPanel variant="sign-in" />
			<AuthFormPanel>
				<Suspense fallback={<SignInFallback />}>
					<SignInForm />
				</Suspense>
			</AuthFormPanel>
		</div>
	);
}
