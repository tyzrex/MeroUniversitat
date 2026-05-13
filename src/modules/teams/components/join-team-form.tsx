'use client';

import { joinTeamByCodeAction } from '@/modules/teams/actions/team.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const TEAM_FORM_PANEL =
	'rounded-2xl border border-slate-200 bg-white p-6 transition-colors focus-within:border-[#1238da]/35 shadow-[0_10px_30px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.03]';

export function JoinTeamForm() {
	const router = useRouter();
	const [code, setCode] = useState('');
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [info, setInfo] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setInfo(null);
		setPending(true);
		const res = await joinTeamByCodeAction({ code });
		setPending(false);
		if (!res.ok) {
			setError(res.error);
			return;
		}
		if (res.data.alreadyMember) {
			setInfo('You’re already in this team.');
		} else {
			setInfo('Joined successfully.');
		}
		setCode('');
		router.refresh();
	}

	return (
		<form className={TEAM_FORM_PANEL} onSubmit={onSubmit}>
			<h3 className="text-lg font-semibold text-[#0d2145]">
				Join with invite code
			</h3>
			<p className="text-muted-foreground mt-1 text-sm">
				Paste the code your team owner shared (case-insensitive).
			</p>
			<div className="mt-4 space-y-2">
				<Label htmlFor="invite-code">Invite code</Label>
				<Input
					id="invite-code"
					required
					minLength={4}
					value={code}
					onChange={(e) => setCode(e.target.value)}
					placeholder="Paste code here"
					autoComplete="off"
				/>
			</div>
			{error ? <p className="text-destructive mt-3 text-sm">{error}</p> : null}
			{info ? (
				<p className="mt-3 text-sm font-medium text-emerald-700">{info}</p>
			) : null}
			<Button
				className="mt-4 w-full rounded-xl bg-[#0d2145] hover:bg-[#1a3461] sm:w-auto"
				disabled={pending}
				type="submit"
			>
				{pending ? (
					<Loader2 className="size-4 animate-spin" />
				) : (
					<>
						<KeyRound className="mr-2 size-4" />
						Join team
					</>
				)}
			</Button>
		</form>
	);
}
