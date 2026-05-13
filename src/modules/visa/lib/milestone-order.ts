/** Mirrors `VisaJourneyMilestone` in `schema.prisma`. */
export const VISA_JOURNEY_MILESTONES = [
	'DOCUMENTS_PREP',
	'UNIVERSITY_ADMIT',
	'CSP_SUBMITTED',
	'WAITING_LIST',
	'PRELIM_REVIEW',
	'CASE_REVIEW',
	'INTERVIEW',
	'PASSPORT_COLLECTED'
] as const;

export type VisaJourneyMilestoneValue =
	(typeof VISA_JOURNEY_MILESTONES)[number];

/** Embassy-side substeps (Nepal waitlist narrative). */
export const EMBASSY_PIPELINE_MILESTONES: readonly VisaJourneyMilestoneValue[] =
	[
		'WAITING_LIST',
		'PRELIM_REVIEW',
		'CASE_REVIEW',
		'INTERVIEW',
		'PASSPORT_COLLECTED'
	];

export const VISA_MILESTONE_LABELS: Record<VisaJourneyMilestoneValue, string> =
	{
		DOCUMENTS_PREP: 'Documents & APS prep',
		UNIVERSITY_ADMIT: 'University admit',
		CSP_SUBMITTED: 'CSP submitted',
		WAITING_LIST: 'Embassy waiting list',
		PRELIM_REVIEW: 'Preliminary review',
		CASE_REVIEW: 'Case review',
		INTERVIEW: 'Interview',
		PASSPORT_COLLECTED: 'Passport / visa collected'
	};

export const VISA_MILESTONE_HINTS: Partial<
	Record<VisaJourneyMilestoneValue, string>
> = {
	WAITING_LIST:
		'When your file entered the embassy queue / waiting list after CSP.',
	PRELIM_REVIEW: 'First embassy-side screening before full review.',
	CASE_REVIEW: 'Formal review stage before interview scheduling.'
};
