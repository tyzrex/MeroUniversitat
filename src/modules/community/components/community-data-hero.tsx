import { buttonVariants } from '@/components/ui/button';
import { DashboardBannerHero } from '@/modules/shared/components/dashboard-banner-hero';
import { cn } from '@/lib/utils';
import { Building2, Send, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

export function CommunityDataHero({
	variant = 'form'
}: Readonly<{
	variant?: 'form' | 'submissions' | 'dashboard';
}>) {
	const isDashboard = variant === 'dashboard';
	const isSubmissions = variant === 'submissions';

	if (isDashboard) {
		return (
			<DashboardBannerHero
				eyebrow="Community acceptance data"
				title="Share & track admission outcomes"
				description={
					<>
						Submit an outcome below, or open your list to check moderation
						status. Every entry is reviewed before it appears publicly.
					</>
				}
				actions={
					<>
						<Link
							className={cn(
								buttonVariants({ size: 'lg' }),
								'h-12 rounded-xl bg-white px-6 font-bold text-[#1238da] hover:bg-blue-50'
							)}
							href="/dashboard/community-data/submissions"
						>
							<ShieldCheck className="size-4" strokeWidth={1.9} />
							My submissions
						</Link>
						<Link
							className={cn(
								buttonVariants({ variant: 'outline', size: 'lg' }),
								'h-12 rounded-xl border-white/35 bg-white/5 px-6 font-bold text-white backdrop-blur hover:bg-white hover:text-[#1238da]'
							)}
							href="/dashboard/universities"
						>
							<Building2 className="size-4" strokeWidth={1.9} />
							University directory
						</Link>
					</>
				}
				minHeightClass="min-h-[285px]"
			/>
		);
	}

	return (
		<header className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-[#0b2bb8]">
			<div
				className="relative min-h-[285px] bg-cover bg-center p-7 text-white md:p-10"
				style={{ backgroundImage: "url('/bannerbg.png')" }}
			>
				<div className="absolute inset-0 bg-gradient-to-r from-[#032c8c]/95 via-[#1432c7]/84 to-[#3935de]/76" />
				<div className="relative flex min-h-[220px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
					<div className="max-w-3xl">
						<span className="inline-flex rounded-lg bg-white/12 px-4 py-2 text-sm font-semibold text-blue-50 backdrop-blur">
							Community Acceptance Data
						</span>
						<h1 className="mt-5 text-4xl font-extrabold tracking-tight text-balance md:text-5xl">
							{isSubmissions
								? 'Browse real admission outcomes'
								: 'Share your university result'}
						</h1>
						<p className="mt-5 max-w-2xl text-base leading-7 text-white/88 md:text-lg">
							{isSubmissions
								? 'Explore approved admission outcomes shared by students so you can compare real profiles, timelines, and decisions.'
								: 'Add your admission outcome and academic snapshot so future applicants can compare realistic profiles. All submissions are reviewed before publishing.'}
						</p>
						<div className="mt-7 flex flex-wrap gap-4">
							<>
								<Link
									className={cn(
										buttonVariants({ size: 'lg' }),
										'h-12 rounded-xl bg-white px-6 font-bold text-[#1238da] hover:bg-blue-50'
									)}
									href="/community-data"
								>
									<Send className="size-4" strokeWidth={1.9} />
									Submit outcome
								</Link>
								<Link
									className={cn(
										buttonVariants({ variant: 'outline', size: 'lg' }),
										'h-12 rounded-xl border-white/35 bg-white/5 px-6 font-bold text-white backdrop-blur hover:bg-white hover:text-[#1238da]'
									)}
									href="/community-data/submissions"
								>
									<ShieldCheck className="size-4" strokeWidth={1.9} />
									View submissions
								</Link>
							</>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}

export function CommunityDataPageWrap({
	children
}: Readonly<{ children: ReactNode }>) {
	return <div className="flex flex-col gap-8">{children}</div>;
}

/** Banner hero matching Community Data — dashboard universities directory. */
export function UniversitiesDirectoryHero({
	shownCount,
	totalCount,
	hasSearchQuery
}: Readonly<{
	shownCount: number;
	totalCount: number;
	hasSearchQuery: boolean;
}>) {
	return (
		<DashboardBannerHero
			eyebrow="University directory"
			title="Browse universities in Germany"
			description={
				<>
					Search by name or city, open full profiles, and track applications
					from your dashboard. Each profile shows how many students already
					track that institution on MeroUniversität.
				</>
			}
			aside={
				<div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur lg:min-w-[200px]">
					<p className="text-xs font-bold tracking-[0.16em] text-blue-100 uppercase">
						{hasSearchQuery ? 'Matches' : 'Showing'}
					</p>
					<p className="mt-1 text-3xl font-extrabold tabular-nums">
						{shownCount}
					</p>
					<p className="text-sm text-white/70">of {totalCount} universities</p>
				</div>
			}
		/>
	);
}
