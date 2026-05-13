import { Badge } from '@/components/ui/badge';

const statusConfig: Record<string, { label: string; class: string }> = {
	PENDING: {
		label: 'Pending',
		class: 'bg-amber-50 text-amber-700 border-amber-200'
	},
	UNDER_REVIEW: {
		label: 'Under review',
		class: 'bg-blue-50 text-blue-700 border-blue-200'
	},
	ACKNOWLEDGED: {
		label: 'Acknowledged',
		class: 'bg-emerald-50 text-emerald-700 border-emerald-200'
	},
	IN_PROGRESS: {
		label: 'In progress',
		class: 'bg-violet-50 text-violet-700 border-violet-200'
	},
	COMPLETED: {
		label: 'Completed',
		class: 'bg-green-50 text-green-700 border-green-200'
	},
	DECLINED: {
		label: 'Declined',
		class: 'bg-rose-50 text-rose-700 border-rose-200'
	}
};

export function FeedbackStatusBadge({ status }: Readonly<{ status: string }>) {
	const cfg = statusConfig[status] ?? {
		label: status,
		class: 'bg-slate-50 text-slate-700 border-slate-200'
	};
	return (
		<Badge
			variant="outline"
			className={`rounded-full font-semibold ${cfg.class}`}
		>
			{cfg.label}
		</Badge>
	);
}

export function FeedbackTypeBadge({ type }: Readonly<{ type: string }>) {
	const labels: Record<string, string> = {
		FEATURE_REQUEST: 'Feature request',
		COMMUNITY_FEEDBACK: 'Community feedback',
		BUG_REPORT: 'Bug report',
		OTHER: 'Other'
	};
	const colors: Record<string, string> = {
		FEATURE_REQUEST: 'bg-indigo-50 text-indigo-700 border-indigo-200',
		COMMUNITY_FEEDBACK: 'bg-teal-50 text-teal-700 border-teal-200',
		BUG_REPORT: 'bg-rose-50 text-rose-700 border-rose-200',
		OTHER: 'bg-slate-50 text-slate-700 border-slate-200'
	};
	return (
		<Badge
			variant="outline"
			className={`rounded-full font-semibold ${colors[type] ?? colors.OTHER}`}
		>
			{labels[type] ?? type}
		</Badge>
	);
}
