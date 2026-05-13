'use client';

import type { KanbanViewMode } from '@/modules/applications/components/applications-kanban-board';
import { cn } from '@/lib/utils';
import {
	Building2,
	LayoutGrid,
	SlidersHorizontal,
	User,
	Users
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

const BASE = '/dashboard/applications/kanban';

type TeamOption = { id: string; name: string };

const VIEW_TABS: {
	id: KanbanViewMode;
	label: string;
	icon?: React.ReactNode;
}[] = [
	{
		id: 'board',
		label: 'Board',
		icon: <LayoutGrid className="size-4" strokeWidth={1.8} />
	},
	{
		id: 'university',
		label: 'University',
		icon: <Building2 className="size-4" strokeWidth={1.8} />
	},
	{
		id: 'member',
		label: 'Member',
		icon: <User className="size-4" strokeWidth={1.8} />
	},
	{
		id: 'team',
		label: 'Team',
		icon: <Users className="size-4" strokeWidth={1.8} />
	},
	{ id: 'solo', label: 'Solo' }
];

function buildHref(opts: {
	view: KanbanViewMode;
	teamId: string;
	nextView?: KanbanViewMode;
	nextTeamId?: string;
}) {
	const view = opts.nextView ?? opts.view;
	const teamId = opts.nextTeamId ?? opts.teamId;
	const params = new URLSearchParams();
	if (view !== 'board') params.set('view', view);
	if (view !== 'solo' && teamId) params.set('team', teamId);
	const q = params.toString();
	return q ? `${BASE}?${q}` : BASE;
}

export function KanbanToolbar({
	view,
	teamId,
	teamOptions
}: Readonly<{
	view: KanbanViewMode;
	teamId?: string;
	teamOptions?: TeamOption[];
}>) {
	const router = useRouter();
	const [, startTransition] = useTransition();
	const currentTeam = teamId ?? '';

	const tabClass = (active: boolean) =>
		cn(
			'inline-flex h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors sm:px-4',
			active
				? 'bg-[#0d2145] text-white hover:bg-[#1a3461]'
				: 'text-slate-600 hover:bg-slate-50'
		);

	return (
		<div
			id="kanban-toolbar-panel"
			className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between"
		>
			<div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2">
				{VIEW_TABS.map((tab) => (
					<Link
						key={tab.id}
						className={tabClass(view === tab.id)}
						href={buildHref({
							view,
							teamId: currentTeam,
							nextView: tab.id,
							nextTeamId: tab.id === 'solo' ? '' : currentTeam
						})}
						prefetch={false}
					>
						{tab.icon}
						{tab.label}
					</Link>
				))}
			</div>

			{teamOptions && teamOptions.length > 0 ? (
				<div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
					<SlidersHorizontal
						className="size-4 shrink-0 text-slate-400"
						strokeWidth={1.8}
						aria-hidden
					/>
					<label className="sr-only" htmlFor="kanban-team-filter">
						Team filter
					</label>
					<select
						id="kanban-team-filter"
						value={view === 'solo' ? '' : currentTeam}
						disabled={view === 'solo'}
						onChange={(e) => {
							const nextTeam = e.target.value;
							const href = buildHref({
								view: view === 'solo' ? 'board' : view,
								teamId: currentTeam,
								nextTeamId: nextTeam
							});
							startTransition(() => router.push(href));
						}}
						className="h-10 min-w-[200px] rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#4a52c8]/25 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<option value="">All teams</option>
						{teamOptions.map((t) => (
							<option key={t.id} value={t.id}>
								{t.name}
							</option>
						))}
					</select>
				</div>
			) : null}
		</div>
	);
}
