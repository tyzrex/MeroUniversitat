import { DashboardPageIntro } from '@/modules/dashboard/components/dashboard-page-intro';
import {
	dashboardOutlineActionClass,
	dashboardPrimaryActionClass
} from '@/modules/dashboard/lib/dashboard-header-actions';
import { ConsularCommunityWaitlist } from '@/modules/visa/components/consular-community-waitlist';
import { ConsularCspHeatmap } from '@/modules/visa/components/consular-csp-heatmap';
import {
	buildJourneyState,
	type CheckpointDto,
	type CommunityWaitlistRow
} from '@/modules/visa/services/visa-journey.service';
import {
	AlertTriangle,
	ArrowRight,
	CalendarClock,
	Check,
	Clock,
	RefreshCw,
	Share2,
	Sparkles
} from 'lucide-react';
import Link from 'next/link';

export function ConsularTimelineView({
	personalCheckpoints,
	stats,
	communityRows,
	heatmapBuckets
}: Readonly<{
	personalCheckpoints: CheckpointDto[];
	stats: { contributorCount: number; checkpointCount: number };
	communityRows: CommunityWaitlistRow[];
	heatmapBuckets: Record<string, number>;
}>) {
	const journey = buildJourneyState(personalCheckpoints);
	const completedIdx = journey.reduce(
		(acc, step, i) => (step.done ? i : acc),
		-1
	);
	const currentIdx =
		completedIdx >= 0 && completedIdx < journey.length - 1
			? completedIdx + 1
			: journey.findIndex((s) => !s.done);

	const doneCount = journey.filter((s) => s.done).length;

	return (
		<div className="flex flex-col gap-8">
			<DashboardPageIntro
				className="rounded-none border-0 bg-transparent p-0 shadow-none ring-0 md:p-0"
				crumbs={[
					{ label: 'Dashboard', href: '/dashboard' },
					{ label: 'Consular timeline' }
				]}
				title={
					<span className="inline-flex items-center gap-2">
						<span aria-hidden>🇩🇪</span>
						German Embassy Nepal
					</span>
				}
				description={
					<>
						Student visa timeline intelligence — community-sourced stages for
						long waits in Kathmandu. Indicative only; verify with official
						updates.
					</>
				}
			>
				<Link
					className={dashboardOutlineActionClass(
						'inline-flex items-center gap-2'
					)}
					href="/dashboard/timelines"
					prefetch={false}
					aria-label="Reload page"
				>
					<RefreshCw className="size-4" strokeWidth={1.75} />
					Refresh
				</Link>
				<Link
					className={dashboardOutlineActionClass(
						'inline-flex items-center gap-2'
					)}
					href="mailto:?subject=MeroUniversit%C3%A4t%20Consular%20timeline"
				>
					<Share2 className="size-4" strokeWidth={1.75} />
					Share
				</Link>
				<Link
					href="/dashboard/visa-journey"
					className={dashboardPrimaryActionClass(
						'inline-flex items-center gap-2 shadow-lg shadow-[#1238da]/25'
					)}
				>
					<Sparkles className="size-4" strokeWidth={1.75} />
					Update my journey
				</Link>
			</DashboardPageIntro>

			<p className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
				<CalendarClock className="size-3.5 shrink-0" strokeWidth={1.75} />
				Updates when milestones are saved. Nepal queue times change often —
				treat as guidance, not guarantees.
			</p>

			<section className="grid gap-4 sm:grid-cols-3">
				<MetricCard
					title="Community contributors"
					value={stats.contributorCount.toLocaleString()}
					delta="opt-in only"
					tone="neutral"
				/>
				<MetricCard
					title="Shared milestones logged"
					value={stats.checkpointCount.toLocaleString()}
					delta="aggregate checkpoints"
					tone="neutral"
				/>
				<MetricCard
					title="Your journey"
					value={
						doneCount > 0 ? `${doneCount}/${journey.length}` : 'Not started'
					}
					delta="dates on Visa journey"
					tone="good"
				/>
			</section>

			<div className="grid gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<ConsularCommunityWaitlist rows={communityRows} />
				</div>
				<section className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/30 p-6 ring-1 ring-slate-900/5 md:p-8">
					<div className="flex items-start justify-between gap-4">
						<div>
							<h2 className="text-lg font-bold text-[#0d2145]">
								Your personal timeline
							</h2>
							<p className="text-muted-foreground mt-2 text-sm">
								From milestones on{' '}
								<Link
									href="/dashboard/visa-journey"
									className="font-semibold text-[#1238da] underline-offset-4 hover:underline"
								>
									Visa journey
								</Link>
								.
							</p>
						</div>
						<Link
							href="/dashboard/visa-journey"
							className="text-sm font-semibold text-[#1238da] hover:underline"
						>
							Edit dates
						</Link>
					</div>
					<ol className="mt-6 space-y-4">
						{journey.map((step, i) => {
							const isCurrent = i === currentIdx && !step.done;
							const isPast = step.done;
							return (
								<li
									key={step.milestone}
									className="flex gap-3 rounded-2xl border border-transparent px-2 py-2 transition-colors hover:border-slate-100 hover:bg-white/60"
								>
									<div className="flex shrink-0 flex-col items-center pt-0.5">
										{isPast ? (
											<span className="flex size-8 items-center justify-center rounded-full bg-emerald-500 text-white">
												<Check className="size-4" strokeWidth={2.5} />
											</span>
										) : isCurrent ? (
											<span className="flex size-8 items-center justify-center rounded-full bg-amber-500 text-white">
												<Clock className="size-4" strokeWidth={2} />
											</span>
										) : (
											<span className="flex size-8 items-center justify-center rounded-full bg-slate-200 text-slate-500">
												<ArrowRight className="size-4 opacity-50" />
											</span>
										)}
									</div>
									<div className="min-w-0 flex-1">
										<p className="font-semibold text-[#0d2145]">{step.label}</p>
										{step.done && step.dateIso ? (
											<p className="text-muted-foreground mt-1 text-xs">
												{new Date(step.dateIso).toLocaleDateString(undefined, {
													dateStyle: 'medium'
												})}
												{step.expectedEta ? (
													<span className="text-amber-800">
														{' '}
														· Est. next:{' '}
														{new Date(step.expectedEta).toLocaleDateString(
															undefined,
															{
																dateStyle: 'medium'
															}
														)}
													</span>
												) : null}
											</p>
										) : isCurrent ? (
											<p className="mt-1 text-xs font-medium text-amber-900">
												Waiting — add dates as you progress.
											</p>
										) : (
											<p className="text-muted-foreground mt-1 text-xs">
												Upcoming
											</p>
										)}
										{step.notes ? (
											<p className="mt-1 text-xs text-slate-600">
												{step.notes}
											</p>
										) : null}
									</div>
								</li>
							);
						})}
					</ol>
				</section>
			</div>

			<ConsularCspHeatmap buckets={heatmapBuckets} />

			<aside className="rounded-3xl border border-amber-200/80 bg-amber-50/60 p-6 ring-1 ring-amber-900/10">
				<div className="flex items-start gap-3">
					<AlertTriangle
						className="size-8 shrink-0 text-amber-700"
						strokeWidth={1.75}
					/>
					<div>
						<h3 className="font-bold text-amber-950">Intake risk checker</h3>
						<p className="mt-2 text-sm leading-relaxed text-amber-950/85">
							Long queues can push late CSP batches past enrolment deadlines.
							Book slack for housing and semester start.
						</p>
						<ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-amber-950/80">
							<li>Movement is uneven month to month.</li>
							<li>Peak seasons stretch prelim and review.</li>
							<li>Use community data as one signal among many.</li>
						</ul>
					</div>
				</div>
			</aside>
		</div>
	);
}

function MetricCard({
	title,
	value,
	delta,
	tone
}: Readonly<{
	title: string;
	value: string;
	delta: string;
	tone: 'good' | 'warn' | 'neutral';
}>) {
	const toneClass =
		tone === 'good'
			? 'text-emerald-700'
			: tone === 'warn'
				? 'text-amber-800'
				: 'text-slate-600';
	return (
		<div className="rounded-2xl border border-slate-200/80 bg-white p-5 ring-1 ring-slate-900/5">
			<p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
				{title}
			</p>
			<p className="mt-2 text-2xl font-bold text-[#0d2145]">{value}</p>
			<p className={`mt-1 text-xs font-medium ${toneClass}`}>{delta}</p>
		</div>
	);
}
