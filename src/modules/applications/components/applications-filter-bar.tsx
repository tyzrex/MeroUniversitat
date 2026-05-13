'use client';

import { cn } from '@/lib/utils';
import { APPLICATION_STATUS_LABELS } from '@/modules/applications/lib/application-status-labels';
import { APPLICATION_STATUSES } from '@/modules/applications/schema/application-form-schema';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';

type TeamOption = { id: string; name: string };

export function ApplicationsFilterBar({
	teamOptions,
	intakeOptions
}: Readonly<{
	teamOptions: TeamOption[];
	intakeOptions: string[];
}>) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [, startTransition] = useTransition();

	const currentTeam = searchParams.get('team') ?? '';
	const currentStatus = searchParams.get('status') ?? '';
	const currentIntake = searchParams.get('intake') ?? '';
	const currentSearch = searchParams.get('q') ?? '';
	const [searchInput, setSearchInput] = useState(currentSearch);

	const hasFilters =
		currentTeam || currentStatus || currentIntake || currentSearch;

	const applyFilter = useCallback(
		(key: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.delete('page');
			if (value) {
				params.set(key, value);
			} else {
				params.delete(key);
			}
			startTransition(() => {
				router.push(`/dashboard/applications?${params.toString()}`);
			});
		},
		[router, searchParams]
	);

	function handleSearchSubmit(e: React.FormEvent) {
		e.preventDefault();
		applyFilter('q', searchInput.trim());
	}

	function clearAll() {
		setSearchInput('');
		startTransition(() => {
			router.push('/dashboard/applications');
		});
	}

	function scrollToFilters() {
		document
			.getElementById('applications-filters')
			?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	return (
		<div
			id="applications-filters"
			className="rounded-2xl border border-slate-200/80 bg-white p-4 ring-1 ring-slate-900/5"
		>
			<div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
				{/* Search */}
				<form
					onSubmit={handleSearchSubmit}
					className="relative min-w-[220px] flex-1"
				>
					<Search
						className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
						strokeWidth={1.8}
					/>
					<input
						type="text"
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						placeholder="Search university, program, or owner…"
						className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pr-4 pl-9 text-sm text-slate-700 transition-colors outline-none placeholder:text-slate-400 focus:border-[#4a52c8]/40 focus:bg-white focus:ring-2 focus:ring-[#4a52c8]/10"
					/>
				</form>

				{teamOptions.length > 0 ? (
					<select
						value={currentTeam}
						onChange={(e) => applyFilter('team', e.target.value)}
						className="h-10 min-w-[140px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm font-medium text-slate-700 transition-colors outline-none focus:border-[#4a52c8]/40 focus:ring-2 focus:ring-[#4a52c8]/10"
					>
						<option value="">All teams</option>
						<option value="solo">Solo only</option>
						{teamOptions.map((t) => (
							<option key={t.id} value={t.id}>
								{t.name}
							</option>
						))}
					</select>
				) : null}

				<select
					value={currentStatus}
					onChange={(e) => applyFilter('status', e.target.value)}
					className="h-10 min-w-[140px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm font-medium text-slate-700 transition-colors outline-none focus:border-[#4a52c8]/40 focus:ring-2 focus:ring-[#4a52c8]/10"
				>
					<option value="">All statuses</option>
					{APPLICATION_STATUSES.map((s) => (
						<option key={s} value={s}>
							{APPLICATION_STATUS_LABELS[s]}
						</option>
					))}
				</select>

				<select
					value={currentIntake}
					onChange={(e) => applyFilter('intake', e.target.value)}
					className="h-10 min-w-[130px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm font-medium text-slate-700 transition-colors outline-none focus:border-[#4a52c8]/40 focus:ring-2 focus:ring-[#4a52c8]/10"
				>
					<option value="">All intakes</option>
					{intakeOptions.map((code) => (
						<option key={code} value={code}>
							{code}
						</option>
					))}
				</select>

				<button
					type="button"
					onClick={scrollToFilters}
					className={cn(
						'inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50'
					)}
				>
					<SlidersHorizontal
						className="size-4 text-slate-500"
						strokeWidth={2}
					/>
					Filters
				</button>

				{hasFilters ? (
					<button
						type="button"
						onClick={clearAll}
						className={cn(
							'inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700'
						)}
					>
						<X className="size-3.5" strokeWidth={2} />
						Clear
					</button>
				) : null}
			</div>
		</div>
	);
}
