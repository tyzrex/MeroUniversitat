import type { ApplicationStatusValue } from '@/modules/applications/schema/application-form-schema';

/** Seven-stage pipeline aligned with the Kanban mock (research → archived). */
export type KanbanColumnId =
	| 'research'
	| 'prepare'
	| 'submitted'
	| 'decision'
	| 'results'
	| 'enrolled'
	| 'archived';

/** Minimal card payload for the Kanban client (serializable). */
export type KanbanBoardCard = {
	id: string;
	userId: string;
	teamId: string | null;
	status: string;
	universityName: string;
	programLabel: string;
	ownerName: string;
	ownerImage: string | null;
	teamLabel: string | null;
	/** University directory logo when linked. */
	logoUrl: string | null;
	city: string | null;
	intakeSemester: string | null;
};

/** Default status when a card is dropped on a column (owners only). */
export function kanbanColumnToDefaultStatus(
	column: KanbanColumnId
): ApplicationStatusValue {
	switch (column) {
		case 'research':
			return 'RESEARCHING';
		case 'prepare':
			return 'PREPARING_DOCS';
		case 'submitted':
			return 'APPLIED';
		case 'decision':
			return 'INTERVIEW';
		case 'results':
			return 'OFFER_LETTER';
		case 'enrolled':
			return 'ENROLLED';
		case 'archived':
			return 'WITHDRAWN';
	}
}

/** Maps pipeline enum → Kanban column. */
export function statusToKanbanColumn(status: string): KanbanColumnId {
	switch (status) {
		case 'INTERESTED':
		case 'RESEARCHING':
			return 'research';
		case 'PREPARING_DOCS':
		case 'READY_TO_APPLY':
			return 'prepare';
		case 'APPLIED':
		case 'UNDER_REVIEW':
			return 'submitted';
		case 'INTERVIEW':
			return 'decision';
		case 'OFFER_LETTER':
			return 'results';
		case 'ENROLLED':
			return 'enrolled';
		case 'REJECTED':
		case 'WITHDRAWN':
			return 'archived';
		default:
			return 'submitted';
	}
}

export const KANBAN_COLUMNS: {
	id: KanbanColumnId;
	title: string;
	dot: string;
	statusHint: string;
}[] = [
	{
		id: 'research',
		title: 'Researching',
		dot: 'bg-sky-500',
		statusHint: 'Interested · Researching'
	},
	{
		id: 'prepare',
		title: 'Preparing',
		dot: 'bg-amber-400',
		statusHint: 'Preparing docs · Ready to apply'
	},
	{
		id: 'submitted',
		title: 'Submitted / active',
		dot: 'bg-violet-500',
		statusHint: 'Applied · Under review'
	},
	{
		id: 'decision',
		title: 'Decision',
		dot: 'bg-orange-500',
		statusHint: 'Interview · decision phase'
	},
	{
		id: 'results',
		title: 'Results',
		dot: 'bg-emerald-500',
		statusHint: 'Offer letter'
	},
	{
		id: 'enrolled',
		title: 'Enrolled',
		dot: 'bg-teal-500',
		statusHint: 'Enrolled'
	},
	{
		id: 'archived',
		title: 'Archived',
		dot: 'bg-slate-400',
		statusHint: 'Rejected · Withdrawn'
	}
];
