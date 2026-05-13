import { UniversityLogo } from '@/modules/community/components/university-logo';
import { listApprovedAcceptanceRecordsPublic } from '@/modules/community/services/acceptance-record.service';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, Database } from 'lucide-react';
import Link from 'next/link';

const resultLabel: Record<string, string> = {
	ACCEPTED: 'Accepted',
	REJECTED: 'Rejected',
	WAITLISTED: 'Waitlisted',
	INTERVIEW: 'Interview',
	PENDING: 'Pending'
};

export async function PublicAcceptanceFeed() {
	const rows = await listApprovedAcceptanceRecordsPublic(12);

	if (rows.length === 0) {
		return (
			<section className="pt-2">
				<div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
					<div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-[#4a52c8]">
						<Database className="size-7" strokeWidth={1.8} />
					</div>
					<h2 className="mt-5 text-xl font-bold text-[#0d2145]">
						No published records yet
					</h2>
					<p className="text-muted-foreground mx-auto mt-2 max-w-xl text-sm leading-6">
						Be the first to share your outcome and help the community compare
						realistic admission profiles.
					</p>
					<Link
						className={cn(
							buttonVariants({ size: 'lg' }),
							'mt-6 h-11 rounded-xl bg-[#0d2145] text-white hover:bg-[#1a3461]'
						)}
						href="/community-data"
					>
						Share outcome
					</Link>
				</div>
			</section>
		);
	}

	return (
		<section className="pt-2">
			<p className="text-muted-foreground mb-6 max-w-3xl text-sm leading-relaxed">
				Records respect each contributor&apos;s anonymity setting. Universities
				link to our directory for deeper context.
			</p>

			<div className="hidden md:block">
				<div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white ring-1 ring-slate-900/5">
					<table className="w-full min-w-[880px] border-collapse text-left text-sm">
						<thead>
							<tr className="border-b border-slate-200 bg-slate-50/95 text-xs font-bold tracking-wide text-slate-500 uppercase">
								<th className="px-4 py-3.5 pl-5">Outcome</th>
								<th className="px-3 py-3.5">Intake</th>
								<th className="min-w-[200px] px-3 py-3.5">University</th>
								<th className="min-w-[160px] px-3 py-3.5">Program</th>
								<th className="px-3 py-3.5">GPA</th>
								<th className="px-3 py-3.5">%</th>
								<th className="px-3 py-3.5">Contributor</th>
								<th className="px-4 py-3.5 pr-5">City</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((r) => {
								const displayName =
									r.isAnonymous || !r.contributorName?.trim()
										? 'Anonymous'
										: r.contributorName;
								const program =
									r.programNameSnapshot?.trim() || 'Program not specified';
								const gpaStr = r.gpa != null ? String(r.gpa) : '—';
								const pctStr =
									r.percentage != null ? String(r.percentage) : '—';

								return (
									<tr
										key={r.id}
										className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/70"
									>
										<td className="px-4 py-3.5 pl-5 align-middle">
											<Badge
												variant="secondary"
												className="rounded-md font-semibold"
											>
												{resultLabel[r.result] ?? r.result}
											</Badge>
										</td>
										<td className="text-muted-foreground px-3 py-3.5 align-middle tabular-nums">
											{r.intake}
										</td>
										<td className="px-3 py-3.5 align-middle">
											<div className="flex items-center gap-3">
												<UniversityLogo
													name={r.university.name}
													logoUrl={r.university.logoUrl}
													imageUrl={r.university.imageUrl}
													size="sm"
													className="shadow-black/5"
												/>
												<Link
													className="font-semibold text-[#0d2145] underline-offset-4 hover:text-[#1238da] hover:underline"
													href={`/universities/${r.university.slug}`}
												>
													{r.university.name}
												</Link>
											</div>
										</td>
										<td className="text-muted-foreground max-w-[240px] px-3 py-3.5 align-middle">
											<span className="line-clamp-2" title={program}>
												{program}
											</span>
										</td>
										<td className="px-3 py-3.5 align-middle tabular-nums">
											{gpaStr}
										</td>
										<td className="px-3 py-3.5 align-middle tabular-nums">
											{pctStr}
										</td>
										<td className="text-muted-foreground px-3 py-3.5 align-middle">
											{displayName}
										</td>
										<td className="text-muted-foreground px-4 py-3.5 pr-5 align-middle">
											{r.university.city}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>

			<ul className="grid gap-5 sm:grid-cols-2 md:hidden">
				{rows.map((r) => {
					const displayName =
						r.isAnonymous || !r.contributorName?.trim()
							? 'Anonymous'
							: r.contributorName;
					const program =
						r.programNameSnapshot?.trim() || 'Program not specified';
					const gpaStr = r.gpa != null ? String(r.gpa) : '—';
					const pctStr = r.percentage != null ? String(r.percentage) : '—';

					return (
						<li
							key={r.id}
							className="group flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)]"
						>
							<div className="flex flex-wrap items-center justify-between gap-2">
								<Badge variant="secondary" className="rounded-md font-semibold">
									{resultLabel[r.result] ?? r.result}
								</Badge>
								<span className="text-muted-foreground text-xs font-medium">
									{r.intake}
								</span>
								<ArrowRight
									className="ml-auto size-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#4a52c8]"
									strokeWidth={1.9}
								/>
							</div>
							<div className="mt-4 flex gap-3">
								<UniversityLogo
									name={r.university.name}
									logoUrl={r.university.logoUrl}
									imageUrl={r.university.imageUrl}
									size="md"
									className="shadow-md shadow-black/5"
								/>
								<div className="min-w-0 flex-1">
									<p className="font-bold text-[#0d2145]">
										<Link
											className="hover:text-primary underline-offset-4 hover:underline"
											href={`/universities/${r.university.slug}`}
										>
											{r.university.name}
										</Link>
									</p>
									<p className="text-muted-foreground mt-1 text-sm">
										{program}
									</p>
								</div>
							</div>
							<div className="text-muted-foreground mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-5 text-xs">
								<span>GPA: {gpaStr}</span>
								<span>%: {pctStr}</span>
							</div>
							<p className="text-muted-foreground mt-3 text-xs">
								{displayName} · {r.university.city}
							</p>
						</li>
					);
				})}
			</ul>

			<div className="mt-8 flex justify-center md:justify-end">
				<Link
					className={cn(
						buttonVariants({ variant: 'outline', size: 'lg' }),
						'h-11 rounded-xl bg-white font-semibold'
					)}
					href="/community-data"
				>
					Add yours
				</Link>
			</div>
		</section>
	);
}
