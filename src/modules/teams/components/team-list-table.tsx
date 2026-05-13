'use client';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check, Copy, ArrowRight, Crown, Search, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type TeamRow = {
	id: string;
	name: string;
	description: string | null;
	inviteCode: string;
	memberCount: number;
	applicationCount: number;
	isOwner: boolean;
	memberRole: string;
	members: { image: string | null; name: string }[];
};

const roleBadgeConfig: Record<
	string,
	{
		label: string;
		variant: 'default' | 'secondary' | 'outline';
		icon?: React.ReactNode;
	}
> = {
	OWNER: {
		label: 'Owner',
		variant: 'default',
		icon: <Crown className="mr-1 size-3" strokeWidth={2} />
	},
	ADMIN: {
		label: 'Admin',
		variant: 'secondary',
		icon: <Shield className="mr-1 size-3" strokeWidth={2} />
	},
	MEMBER: { label: 'Member', variant: 'outline' }
};

const teamTone: Record<string, { chip: string }> = {
	blue: { chip: 'bg-blue-600 text-white' },
	amber: { chip: 'bg-amber-500 text-white' },
	cyan: { chip: 'bg-cyan-600 text-white' },
	rose: { chip: 'bg-rose-600 text-white' },
	indigo: { chip: 'bg-indigo-600 text-white' },
	violet: { chip: 'bg-violet-600 text-white' },
	emerald: { chip: 'bg-emerald-600 text-white' }
};

function pickTone(id: string) {
	const keys = Object.keys(teamTone);
	let h = 0;
	for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
	return teamTone[keys[h % keys.length]]!;
}

function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// fallback
		}
	}

	return (
		<button
			type="button"
			onClick={handleCopy}
			className="group/copy inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100"
			title="Copy invite code"
		>
			<span className="tracking-wider">{text}</span>
			{copied ? (
				<Check className="size-3 text-emerald-600" strokeWidth={2.5} />
			) : (
				<Copy
					className="size-3 text-slate-400 transition-colors group-hover/copy:text-slate-600"
					strokeWidth={1.8}
				/>
			)}
		</button>
	);
}

export function TeamListTable({ rows }: Readonly<{ rows: TeamRow[] }>) {
	const [query, setQuery] = useState('');
	const [role, setRole] = useState<'ALL' | 'OWNER' | 'ADMIN' | 'MEMBER'>('ALL');

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return rows.filter((r) => {
			const matchesQuery =
				q.length === 0 ||
				r.name.toLowerCase().includes(q) ||
				(r.description ?? '').toLowerCase().includes(q) ||
				r.inviteCode.toLowerCase().includes(q);
			const matchesRole = role === 'ALL' || r.memberRole === role;
			return matchesQuery && matchesRole;
		});
	}, [query, role, rows]);

	return (
		<div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/3">
			<div className="border-b border-slate-100 px-6 py-5">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<h2 className="text-lg font-bold text-[#0d2145]">All teams</h2>
						<p className="mt-1 text-sm text-slate-500">
							Search teams, review members, and open a team to manage roles and
							shared applications.
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						<div className="relative w-full sm:w-[260px]">
							<Search
								className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
								strokeWidth={1.8}
							/>
							<Input
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search teams…"
								className="h-10 rounded-xl pl-9 text-sm"
							/>
						</div>
						<select
							className="border-input bg-background h-10 rounded-xl border px-3 text-sm font-semibold text-slate-700 shadow-xs focus-visible:ring-2 focus-visible:ring-[#4a52c8]/30 focus-visible:outline-none"
							value={role}
							onChange={(e) =>
								setRole(e.target.value as 'ALL' | 'OWNER' | 'ADMIN' | 'MEMBER')
							}
						>
							<option value="ALL">All roles</option>
							<option value="OWNER">Owner</option>
							<option value="ADMIN">Admin</option>
							<option value="MEMBER">Member</option>
						</select>
					</div>
				</div>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full min-w-[720px] text-left text-sm">
					<thead className="border-b border-slate-100 bg-slate-50/90">
						<tr>
							<th className="px-6 py-3 font-semibold text-[#0d2145]">Team</th>
							<th className="px-6 py-3 font-semibold text-[#0d2145]">Role</th>
							<th className="px-6 py-3 font-semibold text-[#0d2145]">
								Members
							</th>
							<th className="px-6 py-3 font-semibold text-[#0d2145]">
								Applications
							</th>
							<th className="px-6 py-3 font-semibold text-[#0d2145]">
								Invite code
							</th>
							<th className="px-6 py-3 font-semibold text-[#0d2145]" />
						</tr>
					</thead>
					<tbody>
						{filtered.length === 0 ? (
							<tr>
								<td
									className="px-6 py-12 text-center text-sm text-slate-500"
									colSpan={6}
								>
									<div className="flex flex-col items-center gap-2">
										<p className="font-semibold text-[#0d2145]">
											{rows.length === 0 ? 'No teams yet' : 'No matches'}
										</p>
										<p className="max-w-sm text-xs text-slate-500">
											{rows.length === 0
												? 'Create a team to collaborate with friends, or paste an invite code to join an existing one.'
												: 'Try a different keyword or switch back to all roles.'}
										</p>
									</div>
								</td>
							</tr>
						) : (
							filtered.map((r) => {
								const badge =
									roleBadgeConfig[r.memberRole] ?? roleBadgeConfig.MEMBER;
								const tone = pickTone(r.id);
								const initials =
									//two letters from the first and last word
									r.name
										.split(' ')
										.map((w) => w[0])
										.slice(0, 2)
										.join('')
										.toUpperCase() || '?';
								return (
									<tr
										key={r.id}
										className="group border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/50"
									>
										<td className="px-6 py-4">
											<Link href={`/dashboard/teams/${r.id}`} className="block">
												<div className="flex items-center gap-3">
													<span
														className={cn(
															'flex size-10 items-center justify-center rounded-md text-xs font-extrabold',
															tone.chip
														)}
														aria-hidden
													>
														{initials}
													</span>
													<div className="min-w-0">
														<p className="truncate font-semibold text-[#0d2145] transition-colors group-hover:text-[#4a52c8]">
															{r.name}
														</p>
														{r.description ? (
															<p className="mt-0.5 max-w-xs truncate text-xs text-slate-500">
																{r.description}
															</p>
														) : null}
													</div>
												</div>
											</Link>
										</td>
										<td className="px-6 py-4">
											<Badge variant={badge.variant} className="font-medium">
												{badge.icon}
												{badge.label}
											</Badge>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-2">
												{/* Avatar stack */}
												<div className="flex -space-x-1.5">
													{r.members.slice(0, 4).map((m, i) =>
														m.image ? (
															<Image
																key={`${r.id}-${i}`}
																alt={m.name}
																className="size-6 rounded-full border-2 border-white object-cover"
																height={24}
																src={m.image}
																width={24}
																title={m.name}
															/>
														) : (
															<span
																key={`${r.id}-${i}`}
																className="flex size-6 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[9px] font-bold text-slate-600"
																title={m.name}
															>
																{m.name?.charAt(0)?.toUpperCase() ?? '?'}
															</span>
														)
													)}
													{r.memberCount > 4 ? (
														<span className="flex size-6 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[9px] font-bold text-slate-600">
															+{r.memberCount - 4}
														</span>
													) : null}
												</div>
												<span className="text-xs text-slate-500">
													{r.memberCount}
												</span>
											</div>
										</td>
										<td className="px-6 py-4 text-slate-600">
											{r.applicationCount}
										</td>
										<td className="px-6 py-4">
											<CopyButton text={r.inviteCode} />
										</td>
										<td className="px-6 py-4">
											<Link
												href={`/dashboard/teams/${r.id}`}
												className={cn(
													'inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#4a52c8] transition-all hover:bg-blue-50'
												)}
											>
												Manage
												<ArrowRight className="size-3" strokeWidth={2} />
											</Link>
										</td>
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
