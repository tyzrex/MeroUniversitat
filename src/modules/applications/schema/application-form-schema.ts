import { z } from 'zod';

/** Mirrors Prisma `ApplicationStatus` — keep aligned with schema.prisma */
export const APPLICATION_STATUSES = [
	'INTERESTED',
	'RESEARCHING',
	'PREPARING_DOCS',
	'READY_TO_APPLY',
	'APPLIED',
	'UNDER_REVIEW',
	'INTERVIEW',
	'OFFER_LETTER',
	'REJECTED',
	'ENROLLED',
	'WITHDRAWN'
] as const;

export type ApplicationStatusValue = (typeof APPLICATION_STATUSES)[number];

const emptyToUndefined = (v: unknown) =>
	v === '' || v === null || v === undefined ? undefined : v;

export const applicationCreateSchema = z.object({
	universityId: z.string().min(1, 'Select a university'),
	programName: z.string().max(240).optional().or(z.literal('')),
	intakeSemester: z.string().max(32).optional().or(z.literal('')),
	teamId: z.preprocess(emptyToUndefined, z.string().optional()),
	status: z.enum(APPLICATION_STATUSES),
	notes: z.string().max(4000).optional().or(z.literal('')),
	deadline: z.preprocess(emptyToUndefined, z.string().optional()),
	mirrorsApplicationId: z.preprocess(emptyToUndefined, z.string().optional()),
	applicationGroupId: z.preprocess(emptyToUndefined, z.string().optional())
});

export type ApplicationCreateInput = z.infer<typeof applicationCreateSchema>;

export const applicationUpdateSchema = z.object({
	id: z.string().min(1),
	universityId: z.string().min(1, 'Select a university'),
	programName: z.string().max(240).optional().or(z.literal('')),
	intakeSemester: z.string().max(32).optional().or(z.literal('')),
	teamId: z.preprocess(emptyToUndefined, z.string().optional()),
	status: z.enum(APPLICATION_STATUSES),
	notes: z.string().max(4000).optional().or(z.literal('')),
	deadline: z.preprocess(emptyToUndefined, z.string().optional())
});

export type ApplicationUpdateInput = z.infer<typeof applicationUpdateSchema>;
