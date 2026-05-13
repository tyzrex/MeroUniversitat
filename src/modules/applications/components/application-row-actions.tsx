'use client';

import { deleteApplicationAction } from '@/modules/applications/actions/delete-application.action';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function ApplicationRowActions({
	applicationId,
	isOwner,
	canMeToo,
	mirrorHref
}: Readonly<{
	applicationId: string;
	isOwner: boolean;
	canMeToo: boolean;
	mirrorHref: string;
}>) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [pending, setPending] = useState(false);
	const wrapRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		function onDoc(e: MouseEvent) {
			if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
		}
		document.addEventListener('mousedown', onDoc);
		return () => document.removeEventListener('mousedown', onDoc);
	}, [open]);

	async function onDelete() {
		const ok = window.confirm('Delete this application? This can’t be undone.');
		if (!ok) return;
		setPending(true);
		const res = await deleteApplicationAction({ id: applicationId });
		setPending(false);
		if (!res.ok) {
			window.alert(res.error);
			return;
		}
		setOpen(false);
		router.refresh();
	}

	const showMenu = isOwner;

	return (
		<div ref={wrapRef} className="flex items-center gap-3">
			{canMeToo ? (
				<Link
					href={mirrorHref}
					className="text-sm font-semibold text-orange-600 underline-offset-4 hover:text-orange-700 hover:underline"
				>
					Me too
				</Link>
			) : (
				<span className="text-sm font-medium text-slate-300">—</span>
			)}

			{showMenu ? (
				<div className="relative">
					<button
						type="button"
						aria-expanded={open}
						aria-haspopup="menu"
						disabled={pending}
						onClick={() => setOpen((v) => !v)}
						className={cn(
							'inline-flex size-9 items-center justify-center rounded-lg border border-transparent text-slate-500 transition-colors hover:border-slate-200 hover:bg-slate-50 hover:text-slate-700',
							open && 'border-slate-200 bg-slate-50 text-slate-800'
						)}
					>
						<MoreHorizontal className="size-4" strokeWidth={2} />
					</button>

					{open ? (
						<div
							role="menu"
							className="absolute right-0 z-50 mt-1 min-w-40 rounded-xl border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-slate-900/5"
						>
							<Link
								role="menuitem"
								href={`/dashboard/applications/${applicationId}/edit`}
								className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
								onClick={() => setOpen(false)}
							>
								<Pencil className="size-3.5 text-slate-500" strokeWidth={2} />
								Edit
							</Link>
							<button
								type="button"
								role="menuitem"
								disabled={pending}
								onClick={() => void onDelete()}
								className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
							>
								<Trash2 className="size-3.5" strokeWidth={2} />
								Delete
							</button>
						</div>
					) : null}
				</div>
			) : (
				<span className="inline-flex size-9" aria-hidden />
			)}
		</div>
	);
}
