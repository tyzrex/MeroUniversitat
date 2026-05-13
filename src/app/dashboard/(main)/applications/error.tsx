'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

export default function ApplicationsError({
	error,
	reset
}: Readonly<{
	error: Error & { digest?: string };
	reset: () => void;
}>) {
	useEffect(() => {
		console.error('[applications]', error);
	}, [error]);

	return (
		<div className="flex min-w-0 flex-col gap-4 rounded-2xl border border-red-200 bg-red-50/90 p-6 sm:p-8">
			<div className="flex items-start gap-3">
				<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
					<AlertTriangle className="size-5" strokeWidth={1.8} />
				</span>
				<div className="min-w-0 space-y-1">
					<h2 className="text-base font-semibold text-[#0d2145]">
						Could not load applications
					</h2>
					<p className="text-sm text-slate-700">
						{error.message || 'Something went wrong. Try again in a moment.'}
					</p>
				</div>
			</div>
			<Button type="button" variant="outline" onClick={() => reset()}>
				Try again
			</Button>
		</div>
	);
}
