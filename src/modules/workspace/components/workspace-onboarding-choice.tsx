'use client';

import { completeWorkspaceOnboardingAction } from '@/modules/workspace/actions/complete-workspace-onboarding.action';
import { Button } from '@/components/ui/button';
import { Loader2, User, Users } from 'lucide-react';
import { useState } from 'react';

type Props = Readonly<{
	/** Called after successful solo/team selection (before navigation). */
	onCompleted?: () => void;
}>;

export function WorkspaceOnboardingChoice({ onCompleted }: Props) {
	const [pending, setPending] = useState<'SOLO' | 'TEAM' | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function choose(preference: 'SOLO' | 'TEAM') {
		setError(null);
		setPending(preference);
		const res = await completeWorkspaceOnboardingAction({ preference });

		if (!res.ok) {
			setError(res.error);
			return;
		}
		onCompleted?.();
		setTimeout(() => {
			setPending(null);
			window.location.assign('/dashboard');
		}, 1000);
	}

	return (
		<div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5">
			<div className="bg-gradient-to-br from-[#0d2145] via-[#1e3a6e] to-[#4a52c8] px-8 py-10 text-white md:px-12 md:py-12">
				<p className="text-xs font-bold tracking-[0.2em] text-blue-100">
					Welcome
				</p>
				<h1 className="mt-3 text-2xl font-extrabold tracking-tight text-balance md:text-3xl">
					How do you want to use MeroUniversität?
				</h1>
				<p className="mt-4 max-w-xl text-sm leading-relaxed text-white/78 md:text-base">
					You can track applications on your own, or collaborate with a team.
					Create or join a team anytime from the sidebar — including with an
					invite code.
				</p>
			</div>

			<div className="grid gap-4 bg-slate-50 p-6 md:grid-cols-2 md:p-8">
				<button
					type="button"
					disabled={pending !== null}
					onClick={() => choose('SOLO')}
					className="group flex flex-col items-start rounded-2xl border border-slate-200 bg-white p-6 text-left transition-all hover:border-[#4a52c8]/40 hover:shadow-md disabled:opacity-60"
				>
					<div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-[#4a52c8]">
						{pending === 'SOLO' ? (
							<Loader2 className="size-6 animate-spin" />
						) : (
							<User className="size-6" strokeWidth={1.75} />
						)}
					</div>
					<h2 className="mt-4 text-lg font-bold text-[#0d2145]">
						Continue solo
					</h2>
					<p className="text-muted-foreground mt-2 text-sm leading-relaxed">
						Personal application tracker and Kanban. Join a team later if you
						change your mind.
					</p>
					<span className="text-primary mt-4 text-sm font-semibold group-hover:underline">
						Choose solo
					</span>
				</button>

				<button
					type="button"
					disabled={pending !== null}
					onClick={() => choose('TEAM')}
					className="group flex flex-col items-start rounded-2xl border border-slate-200 bg-white p-6 text-left transition-all hover:border-[#4a52c8]/40 hover:shadow-md disabled:opacity-60"
				>
					<div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-[#4a52c8]">
						{pending === 'TEAM' ? (
							<Loader2 className="size-6 animate-spin" />
						) : (
							<Users className="size-6" strokeWidth={1.75} />
						)}
					</div>
					<h2 className="mt-4 text-lg font-bold text-[#0d2145]">
						Work with a team
					</h2>
					<p className="text-muted-foreground mt-2 text-sm leading-relaxed">
						Share applications and boards with teammates. Next, open Team
						management to create or join.
					</p>
					<span className="text-primary mt-4 text-sm font-semibold group-hover:underline">
						Choose team mode
					</span>
				</button>
			</div>

			{error ? (
				<div className="border-t border-slate-200 px-8 pb-6">
					<p className="text-destructive text-center text-sm">{error}</p>
					<Button
						variant="outline"
						className="mt-3 w-full"
						type="button"
						onClick={() => setError(null)}
					>
						Dismiss
					</Button>
				</div>
			) : null}
		</div>
	);
}
