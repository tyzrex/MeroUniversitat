import { Badge } from '@/components/ui/badge';
import {
	CommunityReviewTable,
	type PendingRow
} from '@/modules/admin/components/community-review-table';
import { listPendingAcceptanceRecords } from '@/modules/community/services/acceptance-record.service';
import { Clock3, Database, ShieldCheck } from 'lucide-react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Community review | Admin',
	description: 'Review and moderate community-contributed content.'
};

export default async function AdminCommunityPage() {
	const raw = await listPendingAcceptanceRecords();
	const rows: PendingRow[] = raw.map((r) => ({
		id: r.id,
		universityName: r.university.name,
		programName: r.programNameSnapshot,
		intake: r.intake,
		result: r.result,
		submitterLabel: r.user
			? `${r.user.name} · ${r.user.email}`
			: 'Guest (not signed in)',
		createdAt: r.createdAt.toISOString()
	}));

	return (
		<div className="space-y-8">
			<header className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.07)] ring-1 ring-slate-900/[0.03]">
				<div className="relative bg-gradient-to-br from-[#0d2145] via-[#253980] to-[#4a52c8] p-7 text-white md:p-10">
					<div className="absolute inset-0 [background-image:radial-gradient(circle_at_12%_18%,white_0,transparent_24%),radial-gradient(circle_at_88%_6%,white_0,transparent_22%)] opacity-25" />
					<div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
						<div>
							<Badge className="mb-4 h-7 rounded-full border-white/20 bg-white/15 px-3 text-white backdrop-blur">
								Moderator workspace
							</Badge>
							<h1 className="text-3xl font-extrabold tracking-tight text-balance md:text-4xl">
								Community review queue
							</h1>
							<p className="mt-4 max-w-3xl text-base leading-relaxed text-white/78">
								Approve trustworthy acceptance records so they appear in public
								stats, or reject submissions that need to stay hidden.
							</p>
						</div>
						<div className="grid min-w-[280px] gap-3 sm:grid-cols-2">
							<div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
								<div className="flex items-center gap-2 text-blue-100">
									<Clock3 className="size-4" strokeWidth={1.8} />
									<span className="text-xs font-bold tracking-[0.16em] uppercase">
										Pending
									</span>
								</div>
								<p className="mt-2 text-3xl font-extrabold">{rows.length}</p>
							</div>
							<div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
								<div className="flex items-center gap-2 text-blue-100">
									<ShieldCheck className="size-4" strokeWidth={1.8} />
									<span className="text-xs font-bold tracking-[0.16em] uppercase">
										Mode
									</span>
								</div>
								<p className="mt-2 text-sm font-bold">Manual review</p>
							</div>
						</div>
					</div>
				</div>
			</header>

			<section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03] md:p-6">
				<div className="mb-5 flex flex-wrap items-center justify-between gap-3">
					<div className="flex items-center gap-3">
						<div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-[#4a52c8]">
							<Database className="size-5" strokeWidth={1.8} />
						</div>
						<div>
							<h2 className="font-bold text-[#0d2145]">Pending submissions</h2>
							<p className="text-muted-foreground text-sm">
								Oldest records appear first to keep moderation fair.
							</p>
						</div>
					</div>
				</div>
				<CommunityReviewTable rows={rows} />
			</section>
		</div>
	);
}
