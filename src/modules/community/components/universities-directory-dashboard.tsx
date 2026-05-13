import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UniversityLogo } from '@/modules/community/components/university-logo';
import { UniversityRequestNotice } from '@/modules/community/components/university-request-notice';
import { listUniversitiesDirectory } from '@/modules/community/services/university.service';
import { DashboardPageIntro } from '@/modules/dashboard/components/dashboard-page-intro';
import { ArrowRight, MapPin, Search } from 'lucide-react';
import Link from 'next/link';

export async function UniversitiesDirectoryDashboard({
	query,
	page
}: Readonly<{ query: string; page: number }>) {
	const {
		rows: universities,
		total,
		page: safePage
	} = await listUniversitiesDirectory({
		query,
		page,
		pageSize: 24
	});
	const shownCount = universities.length;
	const hasMore = shownCount < total;

	return (
		<>
			<DashboardPageIntro
				title="Universities Directory"
				crumbs={[
					{ label: 'Dashboard', href: '/dashboard' },
					{ label: 'Universities', href: '/dashboard/universities' }
				]}
				description="Browse our directory of universities"
				className="rounded-none border-0 bg-transparent p-0 shadow-none ring-0 md:p-0"
			/>

			<UniversityRequestNotice className="mt-4" />

			<form
				className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/3 sm:flex sm:items-center sm:gap-3"
				action="/dashboard/universities"
				method="get"
			>
				<div className="relative min-w-0 flex-1">
					<Search
						aria-hidden
						className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400"
						strokeWidth={1.8}
					/>
					<input
						className="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-12 w-full rounded-2xl border bg-slate-50/80 px-4 pl-12 text-sm shadow-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
						defaultValue={query}
						name="q"
						placeholder="Search name or city…"
						type="search"
					/>
				</div>
				<button
					className="mt-3 h-12 w-full rounded-2xl bg-[#0d2145] px-6 text-sm font-bold text-white shadow-lg shadow-[#0d2145]/15 transition-colors hover:bg-[#1a3461] sm:mt-0 sm:w-auto"
					type="submit"
				>
					Search
				</button>
			</form>

			{universities.length === 0 ? (
				<section className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
					<div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-[#4a52c8]">
						<Search className="size-7" strokeWidth={1.8} />
					</div>
					<h2 className="mt-5 text-xl font-bold text-[#0d2145]">
						No universities found
					</h2>
					<p className="text-muted-foreground mx-auto mt-2 max-w-xl text-sm leading-6">
						No universities match “{query}”. Try another search or run the seed
						script locally.
					</p>
				</section>
			) : (
				<ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
					{universities.map((u) => (
						<li key={u.id}>
							<Link
								className="group flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/3 transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)]"
								href={`/dashboard/universities/${u.slug}`}
							>
								<div className="flex items-start justify-between gap-4">
									<div className="flex gap-4">
										<UniversityLogo
											name={u.name}
											logoUrl={u.logoUrl}
											imageUrl={u.imageUrl}
											size="md"
											className="shadow-lg shadow-[#0d2145]/15"
										/>
										<div className="min-w-0">
											<div className="flex flex-wrap items-center gap-2">
												<p className="leading-6 font-bold text-[#0d2145] transition-colors group-hover:text-[#4a52c8]">
													{u.name}
												</p>
												{u.verificationStatus === 'PENDING' ? (
													<Badge className="h-5 rounded-full border-amber-200 bg-amber-50 text-[10px] font-semibold text-amber-900">
														Unverified
													</Badge>
												) : null}
											</div>
											<p className="text-muted-foreground mt-1 inline-flex items-center gap-1.5 text-sm">
												<MapPin className="size-4" strokeWidth={1.8} />
												{u.city}
												{u.state ? `, ${u.state}` : ''}
											</p>
										</div>
									</div>
									<ArrowRight
										className="size-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#4a52c8]"
										strokeWidth={1.9}
									/>
								</div>

								{u.description ? (
									<p className="text-muted-foreground mt-5 line-clamp-3 text-sm leading-6">
										{u.description}
									</p>
								) : null}

								<div className="mt-auto flex flex-wrap gap-2 border-t border-slate-100 pt-5 text-xs font-bold text-slate-600">
									<span className="rounded-full bg-violet-50 px-3 py-1 text-violet-900">
										{u._count.applications} application
										{u._count.applications === 1 ? '' : 's'} tracked
									</span>
									{u.ranking != null ? (
										<span className="rounded-full bg-blue-50 px-3 py-1 text-[#4a52c8]">
											Rank #{u.ranking}
										</span>
									) : null}
								</div>
							</Link>
						</li>
					))}
				</ul>
			)}

			{hasMore ? (
				<div className="mt-8 flex justify-center">
					<Link
						className={cn(
							buttonVariants({ variant: 'outline', size: 'lg' }),
							'h-11 rounded-xl bg-white font-semibold'
						)}
						href={`/dashboard/universities?q=${encodeURIComponent(
							query
						)}&page=${safePage + 1}`}
						scroll={false}
					>
						Load more ({shownCount} of {total})
					</Link>
				</div>
			) : null}

			<div className="mt-10 flex justify-center">
				<Link
					className={cn(
						buttonVariants({ variant: 'outline', size: 'lg' }),
						'h-11 rounded-xl bg-white font-semibold'
					)}
					href="/dashboard/community-data"
				>
					Share your university outcome
				</Link>
			</div>
		</>
	);
}
