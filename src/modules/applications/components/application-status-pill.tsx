import type { ApplicationStatusValue } from '@/modules/applications/schema/application-form-schema';
import { applicationStatusLabel } from '@/modules/applications/lib/application-status-labels';
import { cn } from '@/lib/utils';

const statusTone: Record<ApplicationStatusValue, { bg: string; text: string }> =
	{
		INTERESTED: {
			bg: 'bg-amber-100',
			text: 'text-amber-900'
		},
		RESEARCHING: {
			bg: 'bg-slate-100',
			text: 'text-slate-800'
		},
		PREPARING_DOCS: {
			bg: 'bg-orange-50',
			text: 'text-orange-900'
		},
		READY_TO_APPLY: {
			bg: 'bg-sky-50',
			text: 'text-sky-900'
		},
		APPLIED: {
			bg: 'bg-blue-100',
			text: 'text-blue-900'
		},
		UNDER_REVIEW: {
			bg: 'bg-violet-100',
			text: 'text-violet-900'
		},
		INTERVIEW: {
			bg: 'bg-purple-100',
			text: 'text-purple-900'
		},
		OFFER_LETTER: {
			bg: 'bg-emerald-100',
			text: 'text-emerald-900'
		},
		REJECTED: {
			bg: 'bg-red-50',
			text: 'text-red-800'
		},
		ENROLLED: {
			bg: 'bg-teal-50',
			text: 'text-teal-900'
		},
		WITHDRAWN: {
			bg: 'bg-neutral-100',
			text: 'text-neutral-700'
		}
	};

export function ApplicationStatusPill({
	status,
	className
}: Readonly<{ status: string; className?: string }>) {
	const tone = statusTone[status as ApplicationStatusValue] ?? {
		bg: 'bg-slate-100',
		text: 'text-slate-800'
	};

	return (
		<span
			className={cn(
				'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
				tone.bg,
				tone.text,
				className
			)}
		>
			{applicationStatusLabel(status)}
		</span>
	);
}
