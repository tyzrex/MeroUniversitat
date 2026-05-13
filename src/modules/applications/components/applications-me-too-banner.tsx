export function ApplicationsMeTooBanner() {
	return (
		<section
			aria-labelledby="me-too-heading"
			className="relative overflow-hidden rounded-3xl border border-sky-200/80 bg-gradient-to-br from-sky-50 via-blue-50/80 to-white p-6 md:p-8"
		>
			<div className="relative z-[1] max-w-[min(100%,42rem)]">
				<h2
					id="me-too-heading"
					className="text-lg font-extrabold tracking-tight text-[#0d2145] md:text-xl"
				>
					What is &quot;Me too&quot;?
				</h2>
				<p className="mt-2 text-sm leading-relaxed text-slate-600 md:text-base">
					When a teammate adds an application to your shared team, you can use{' '}
					<strong className="font-semibold text-orange-700">Me too</strong> to
					create your own linked row for the same university—without retyping
					everything. Your progress and documents stay separate; the team still
					sees who applied where.
				</p>
			</div>
			<div
				aria-hidden
				className="pointer-events-none absolute right-4 -bottom-6 hidden h-28 w-36 rounded-2xl bg-sky-100/90 opacity-90 shadow-inner md:block"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute top-8 -right-4 hidden size-24 rounded-full bg-blue-200/40 blur-2xl md:block"
			/>
		</section>
	);
}
