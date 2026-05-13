import type * as React from 'react';

/** Gradient hero matching Community Data / My contributions dashboard styling. */
export function DashboardSectionHero({
	eyebrow,
	title,
	description,
	children
}: Readonly<{
	eyebrow: React.ReactNode;
	title: string;
	description?: string;
	/** Actions / secondary links (right side on large screens). */
	children?: React.ReactNode;
}>) {
	return (
		<header className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.07)] ring-1 ring-slate-900/[0.03]">
			<div className="relative bg-gradient-to-br from-[#0d2145] via-[#263b8b] to-[#4a52c8] p-7 text-white md:p-10">
				<div className="absolute inset-0 [background-image:radial-gradient(circle_at_12%_18%,white_0,transparent_24%),radial-gradient(circle_at_88%_6%,white_0,transparent_22%)] opacity-25" />
				<div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
					<div className="max-w-4xl">
						<div className="mb-3 text-xs font-bold tracking-[0.24em] text-blue-100 uppercase">
							{eyebrow}
						</div>
						<h1 className="text-3xl font-extrabold tracking-tight text-balance md:text-4xl">
							{title}
						</h1>
						{description ? (
							<p className="mt-4 max-w-3xl text-base leading-relaxed text-white/78">
								{description}
							</p>
						) : null}
					</div>
					{children ? (
						<div className="flex flex-shrink-0 flex-wrap gap-3">{children}</div>
					) : null}
				</div>
			</div>
		</header>
	);
}
