'use client';

import { Button } from '@/components/ui/button';
import { deleteApplicationAction } from '@/modules/applications/actions/delete-application.action';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DeleteApplicationButton({
	id,
	label = 'Delete application'
}: Readonly<{ id: string; label?: string }>) {
	const router = useRouter();
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onDelete() {
		const ok = window.confirm('Delete this application? This can’t be undone.');
		if (!ok) return;

		setPending(true);
		setError(null);
		const res = await deleteApplicationAction({ id });
		setPending(false);
		if (!res.ok) {
			setError(res.error);
			return;
		}
		router.push('/dashboard/applications');
		router.refresh();
	}

	return (
		<div className="flex flex-col items-start gap-2">
			<Button
				type="button"
				variant="destructive"
				disabled={pending}
				onClick={onDelete}
			>
				<Trash2 className="size-4" strokeWidth={1.8} />
				{label}
			</Button>
			{error ? <p className="text-destructive text-sm">{error}</p> : null}
		</div>
	);
}
