'use client';

import { createTeamAction } from '@/modules/teams/actions/team.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const TEAM_FORM_PANEL =
	'rounded-2xl border border-slate-200 bg-white p-6 transition-colors focus-within:border-[#1238da]/35 shadow-[0_10px_30px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.03]';

export function CreateTeamForm() {
	const router = useRouter();
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setPending(true);
		const res = await createTeamAction({ name, description });
		setPending(false);
		if (!res.ok) {
			setError(res.error);
			return;
		}
		setName('');
		setDescription('');
		router.refresh();
	}

	return (
		<form className={TEAM_FORM_PANEL} onSubmit={onSubmit}>
			<h3 className="text-lg font-semibold text-[#0d2145]">Create a team</h3>
			<p className="text-muted-foreground mt-1 text-sm">
				You become the owner and get an invite code to share.
			</p>
			<div className="mt-4 space-y-4">
				<div className="space-y-2">
					<Label htmlFor="team-name">Team name</Label>
					<Input
						id="team-name"
						required
						minLength={2}
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="e.g. Code to Germany"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="team-desc">Description (optional)</Label>
					<Input
						id="team-desc"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Short purpose or focus area"
					/>
				</div>
			</div>
			{error ? <p className="text-destructive mt-3 text-sm">{error}</p> : null}
			<Button
				className="mt-4 w-full rounded-xl bg-[#0d2145] hover:bg-[#1a3461] sm:w-auto"
				disabled={pending}
				type="submit"
			>
				{pending ? (
					<Loader2 className="size-4 animate-spin" />
				) : (
					<>
						<Plus className="mr-2 size-4" />
						Create team
					</>
				)}
			</Button>
		</form>
	);
}
