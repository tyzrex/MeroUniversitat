import type { CommunityWaitlistRow } from '@/modules/visa/services/visa-journey.service';

const STAGE_KEYS = [
	'WAITING_LIST',
	'PRELIM_REVIEW',
	'CASE_REVIEW',
	'INTERVIEW',
	'PASSPORT_COLLECTED'
] as const;

function stageShort(k: (typeof STAGE_KEYS)[number]): string {
	switch (k) {
		case 'WAITING_LIST':
			return 'Queue';
		case 'PRELIM_REVIEW':
			return 'Prelim';
		case 'CASE_REVIEW':
			return 'Review';
		case 'INTERVIEW':
			return 'Interview';
		case 'PASSPORT_COLLECTED':
			return 'Passport';
		default:
			return k;
	}
}

function statusFor(row: CommunityWaitlistRow): {
	label: string;
	className: string;
} {
	if (row.stages.PASSPORT_COLLECTED) {
		return { label: 'Collected', className: 'bg-emerald-100 text-emerald-900' };
	}
	if (row.stages.INTERVIEW) {
		return { label: 'Interview', className: 'bg-blue-100 text-blue-900' };
	}
	if (
		row.stages.CASE_REVIEW ||
		row.stages.PRELIM_REVIEW ||
		row.stages.WAITING_LIST
	) {
		return { label: 'Waiting', className: 'bg-amber-100 text-amber-900' };
	}
	return { label: 'Started', className: 'bg-slate-100 text-slate-700' };
}

export function ConsularCommunityWaitlist({
	rows
}: Readonly<{
	rows: CommunityWaitlistRow[];
}>) {
	if (rows.length === 0) {
		return (
			<section className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
				<p className="font-semibold text-[#0d2145]">No community rows yet</p>
				<p className="text-muted-foreground mt-2 text-sm">
					Opt in on your profile and add embassy milestones — anonymized rows
					appear here for peers.
				</p>
			</section>
		);
	}

	return (
		<section className="h-full rounded-3xl border border-slate-200/80 bg-white p-6 ring-1 ring-slate-900/5 md:p-8">
			<h2 className="text-lg font-bold text-[#0d2145]">
				Waitlist tracker (community)
			</h2>
			<p className="text-muted-foreground mt-2 text-sm leading-relaxed">
				Anonymous embassy-stage checkpoints from opted-in users.
			</p>
			<div className="mt-6 overflow-x-auto">
				<table className="w-full min-w-[640px] text-left text-sm">
					<thead>
						<tr className="border-b border-slate-200 text-xs tracking-wide text-slate-500 uppercase">
							<th className="pr-4 pb-3 font-medium">Contributor</th>
							<th className="pr-4 pb-3 font-medium">Intake</th>
							{STAGE_KEYS.map((k) => (
								<th key={k} className="px-1 pb-3 text-center font-medium">
									{stageShort(k)}
								</th>
							))}
							<th className="pb-3 pl-2 text-right font-medium">Status</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{rows.map((row) => {
							const st = statusFor(row);
							return (
								<tr key={row.anonLabel}>
									<td className="py-3 pr-4 font-medium text-[#0d2145]">
										{row.anonLabel}
									</td>
									<td className="text-muted-foreground py-3 pr-4">
										{row.intake ?? '—'}
									</td>
									{STAGE_KEYS.map((k) => (
										<td key={k} className="px-1 py-3 text-center">
											{row.stages[k] ? (
												<span
													className="inline-flex size-2.5 rounded-full bg-emerald-500"
													title={row.stages[k]}
												/>
											) : (
												<span className="inline-flex size-2.5 rounded-full bg-slate-200" />
											)}
										</td>
									))}
									<td className="py-3 pl-2 text-right">
										<span
											className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${st.className}`}
										>
											{st.label}
										</span>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</section>
	);
}
