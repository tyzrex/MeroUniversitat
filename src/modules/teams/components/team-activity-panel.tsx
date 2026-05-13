import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
	listTeamActivityForUser,
	type TeamActivityItem
} from '@/modules/teams/services/team-activity.service';

function formatTime(d: Date) {
	return new Intl.DateTimeFormat('en', {
		month: 'short',
		day: 'numeric'
	}).format(d);
}

function Avatar({
	name,
	image,
	seed
}: Readonly<{ name: string; image: string | null; seed: string }>) {
	const initials =
		name
			.split(/\s+/)
			.filter(Boolean)
			.map((w) => w[0])
			.slice(0, 2)
			.join('')
			.toUpperCase() || '?';

	const solid = pickSolid(seed);

	return image ? (
		<Image
			src={image}
			alt={name}
			width={28}
			height={28}
			className="size-7 rounded-full object-cover ring-2 ring-white"
		/>
	) : (
		<span
			className={cn(
				'flex size-7 items-center justify-center rounded-full text-[10px] font-extrabold text-white ring-2 ring-white',
				solid
			)}
			aria-hidden
		>
			{initials}
		</span>
	);
}

function pickSolid(seed: string) {
	const colors = [
		'bg-blue-600',
		'bg-indigo-600',
		'bg-violet-600',
		'bg-emerald-600',
		'bg-amber-500',
		'bg-rose-600',
		'bg-cyan-600'
	];
	let h = 0;
	for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
	return colors[h % colors.length]!;
}

function itemText(item: TeamActivityItem) {
	switch (item.type) {
		case 'member_joined':
			return 'joined the team';
		case 'application_created':
			return 'added an application';
		case 'application_updated':
			return 'updated an application';
	}
}

export async function TeamActivityPanel({
	userId
}: Readonly<{
	userId: string;
}>) {
	const items = await listTeamActivityForUser(userId, 10);

	return (
		<div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/3">
			<div className="flex items-center justify-between gap-3">
				<h3 className="text-lg font-bold text-[#0d2145]">Team activity</h3>
				<Badge
					variant="outline"
					className="h-7 rounded-full px-3 font-semibold"
				>
					Recent
				</Badge>
			</div>
			<p className="mt-1 text-sm text-slate-500">
				A lightweight log based on member joins and team application changes.
			</p>

			{items.length === 0 ? (
				<p className="mt-5 text-sm text-slate-500">No team activity yet.</p>
			) : (
				<ul className="mt-5 space-y-3">
					{items.map((it, idx) => (
						<li
							key={`${it.type}-${it.teamId}-${it.at.toISOString()}-${idx}`}
							className="flex items-start gap-3"
						>
							<Avatar
								name={it.actorName}
								image={it.actorImage}
								seed={`${it.teamId}:${it.actorName}`}
							/>
							<div className="min-w-0 flex-1">
								<p className="text-sm text-slate-700">
									<span className="font-semibold text-[#0d2145]">
										{it.actorName}
									</span>{' '}
									{itemText(it)}{' '}
									<Link
										className={cn(
											'font-semibold text-[#4a52c8] hover:underline'
										)}
										href={`/dashboard/teams/${it.teamId}`}
									>
										{it.teamName}
									</Link>
									{it.type === 'application_created' ||
									it.type === 'application_updated' ? (
										<>
											{' '}
											<span className="text-slate-400">·</span>{' '}
											<span className="text-slate-600">
												{it.universityName}
											</span>
										</>
									) : null}
								</p>
								<p className="mt-0.5 text-xs text-slate-400">
									{formatTime(it.at)}
								</p>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
