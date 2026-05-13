'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field';
import { submitAcceptanceRecordAction } from '@/modules/community/actions/submit-acceptance-record.action';
import {
	ENGLISH_TEST_LABELS,
	ENGLISH_TEST_VALUES
} from '@/modules/community/constants/english-test';
import {
	acceptanceRecordFormSchema,
	admissionResults,
	germanLevels,
	type AcceptanceRecordFormInput
} from '@/modules/community/schema/acceptance-record-form-schema';
import { UniversityPicker } from '@/modules/community/components/university-picker';
import {
	RHFCheckbox,
	RHFInput,
	RHFSelect,
	RHFTextarea
} from '@/modules/shared/components/form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	BookOpen,
	CalendarCheck2,
	FileCheck2,
	GraduationCap,
	Loader2,
	Send,
	ShieldCheck,
	User,
	UserRound
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

const admissionLabels: Record<(typeof admissionResults)[number], string> = {
	ACCEPTED: 'Accepted',
	REJECTED: 'Rejected',
	WAITLISTED: 'Waitlisted',
	INTERVIEW: 'Interview',
	PENDING: 'Pending'
};

const germanLabels: Record<(typeof germanLevels)[number], string> = {
	NONE: 'None',
	A1: 'A1',
	A2: 'A2',
	B1: 'B1',
	B2: 'B2',
	C1: 'C1',
	C2: 'C2'
};

const formPanel =
	'rounded-2xl border border-slate-200 bg-white p-6 transition-colors focus-within:border-[#1238da]/35';

type Props = Readonly<{
	defaultContributorName: string;
	isLoggedIn: boolean;
	/** Maps saved profile academics into the acceptance form when logged in. */
	profilePrefill?: Partial<
		Pick<
			AcceptanceRecordFormInput,
			| 'gpa'
			| 'percentage'
			| 'englishTestType'
			| 'englishTestScore'
			| 'germanLevel'
			| 'nepalBoard'
			| 'subject'
			| 'workExperienceYrs'
		>
	>;
}>;

export function CommunityAcceptanceForm({
	defaultContributorName,
	isLoggedIn,
	profilePrefill
}: Props) {
	const panelClass = formPanel;
	const [activeStep, setActiveStep] = useState(0);

	function activateStep(step: number) {
		setActiveStep(step);
		const target = document.querySelector<HTMLElement>(
			`[data-form-step="${step}"]`
		);
		target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}
	const defaultValues = useMemo<AcceptanceRecordFormInput>(
		() => ({
			contributorName: defaultContributorName,
			universityId: '',
			programId: '',
			programNameFree: '',
			gpa: undefined,
			percentage: undefined,
			englishTestType: 'NONE',
			englishTestScore: '',
			germanLevel: 'NONE',
			nepalBoard: '',
			subject: '',
			workExperienceYrs: undefined,
			hasAPS: false,
			intake: '',
			result: 'PENDING',
			appliedDate: '',
			responseDate: '',
			offerDate: '',
			notes: '',
			isAnonymous: false,
			...profilePrefill
		}),
		[defaultContributorName, profilePrefill]
	);

	const form = useForm<AcceptanceRecordFormInput>({
		resolver: zodResolver(acceptanceRecordFormSchema),
		defaultValues,
		mode: 'onBlur'
	});

	const [submitError, setSubmitError] = useState<string | null>(null);
	const [done, setDone] = useState<{
		id: string;
		moderationStatus: string;
	} | null>(null);

	async function onSubmit(values: AcceptanceRecordFormInput) {
		setSubmitError(null);
		setDone(null);
		const result = await submitAcceptanceRecordAction(values);
		if (!result.ok) {
			setSubmitError(result.error);
			return;
		}
		setDone({
			id: result.data.id,
			moderationStatus: result.data.moderationStatus
		});
		form.reset(defaultValues);
	}

	return (
		<Form {...form}>
			<form
				className="flex w-full max-w-none flex-col gap-6 rounded-2xl border-slate-200 p-0 sm:border sm:bg-white sm:p-6 md:p-8"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				{done ? (
					<Alert
						className={
							done.moderationStatus === 'PENDING'
								? 'rounded-xl border-amber-200/90 bg-amber-50 text-amber-950'
								: 'rounded-xl border-emerald-200 bg-emerald-50 text-emerald-950'
						}
					>
						<AlertTitle>
							{done.moderationStatus === 'PENDING'
								? 'Received — pending review'
								: 'Thanks — published'}
						</AlertTitle>
						<AlertDescription>
							{done.moderationStatus === 'PENDING'
								? 'Your record was saved and is awaiting moderator approval before it appears in public stats.'
								: 'Your acceptance record is visible in community stats (subject to normal moderation rules).'}
						</AlertDescription>
					</Alert>
				) : null}

				{submitError ? (
					<Alert variant="destructive" className="rounded-xl">
						<AlertTitle>Could not submit</AlertTitle>
						<AlertDescription>{submitError}</AlertDescription>
					</Alert>
				) : null}

				<CommunityFormSteps
					activeStep={activeStep}
					onStepClick={activateStep}
				/>

				<div className="grid w-full min-w-0 gap-6 xl:grid-cols-2 xl:items-start xl:gap-6">
					<div className="min-w-0 space-y-6">
						<FieldSet
							className={panelClass}
							data-form-step="0"
							onClick={() => setActiveStep(0)}
							onFocusCapture={() => setActiveStep(0)}
						>
							<div className="mb-3 flex items-center gap-3 text-lg font-bold text-[#0d2145]">
								<span className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-[#1238da]">
									<UserRound className="size-5" strokeWidth={1.8} />
								</span>
								About you
							</div>
							<FieldGroup className="gap-5">
								<RHFInput<AcceptanceRecordFormInput>
									control={form.control}
									name="contributorName"
									label="Your name (optional)"
									placeholder={
										isLoggedIn
											? 'Prefilled from your account — edit if you want'
											: 'How you’d like to be credited'
									}
									icon={User}
									autoComplete="name"
									description="Leave blank or submit anonymously below if you prefer not to share your name publicly."
								/>

								<RHFCheckbox<AcceptanceRecordFormInput>
									control={form.control}
									name="isAnonymous"
									label="Submit anonymously"
									description="Your name will be hidden in public views (we still store the record for moderation)."
								/>
							</FieldGroup>
						</FieldSet>

						<FieldSet
							className={panelClass}
							onClick={() => setActiveStep(0)}
							onFocusCapture={() => setActiveStep(0)}
						>
							<div className="mb-3 flex items-center gap-3 text-lg font-bold text-[#0d2145]">
								<span className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-[#1238da]">
									<GraduationCap className="size-5" strokeWidth={1.8} />
								</span>
								Academic snapshot
							</div>
							<div className="grid gap-5 sm:grid-cols-2">
								<RHFInput
									control={form.control}
									name="gpa"
									label="GPA (German scale 0–4)"
									placeholder="e.g. 3.2"
									inputMode="decimal"
								/>
								<RHFInput
									control={form.control}
									name="percentage"
									label="Percentage (0–100)"
									placeholder="e.g. 72"
									inputMode="decimal"
								/>
							</div>

							<div className="mt-5 grid gap-5 sm:grid-cols-2">
								<RHFSelect<AcceptanceRecordFormInput>
									control={form.control}
									name="englishTestType"
									label="English proficiency test"
								>
									{ENGLISH_TEST_VALUES.map((v) => (
										<option key={v} value={v}>
											{ENGLISH_TEST_LABELS[v]}
										</option>
									))}
								</RHFSelect>
								<RHFInput
									control={form.control}
									name="englishTestScore"
									label="Test score"
									placeholder="e.g. 7.5 (IELTS), 105 (TOEFL)"
								/>
							</div>

							<div className="mt-5 grid gap-5 sm:grid-cols-2">
								<RHFSelect<AcceptanceRecordFormInput>
									control={form.control}
									name="germanLevel"
									label="German level"
								>
									{germanLevels.map((v) => (
										<option key={v} value={v}>
											{germanLabels[v]}
										</option>
									))}
								</RHFSelect>
								<RHFInput
									control={form.control}
									name="workExperienceYrs"
									label="Work experience (years)"
									placeholder="0"
									inputMode="numeric"
								/>
							</div>

							<div className="mt-5 grid gap-5 sm:grid-cols-2">
								<RHFInput
									control={form.control}
									name="nepalBoard"
									label="Nepal board / institution"
									placeholder="e.g. TU, KU"
								/>
								<RHFInput
									control={form.control}
									name="subject"
									label="Subject / field"
									placeholder="e.g. Computer Engineering"
								/>
							</div>

							<div className="mt-5">
								<RHFCheckbox<AcceptanceRecordFormInput>
									control={form.control}
									name="hasAPS"
									label="APS completed"
								/>
							</div>
						</FieldSet>
					</div>

					<div className="min-w-0 space-y-6">
						<FieldSet
							className={panelClass}
							data-form-step="1"
							onClick={() => setActiveStep(1)}
							onFocusCapture={() => setActiveStep(1)}
						>
							<div className="mb-3 flex items-center gap-3 text-lg font-bold text-[#0d2145]">
								<span className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-[#1238da]">
									<FileCheck2 className="size-5" strokeWidth={1.8} />
								</span>
								Application
							</div>
							<FieldGroup className="gap-5">
								<FormField
									control={form.control}
									name="universityId"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-semibold text-slate-700">
												University
											</FormLabel>
											<FormDescription>
												Search the seeded list — run the seed script locally if
												empty.
											</FormDescription>
											<UniversityPicker
												value={field.value}
												onChange={field.onChange}
											/>
											<FormMessage />
										</FormItem>
									)}
								/>

								<RHFInput<AcceptanceRecordFormInput>
									control={form.control}
									name="programNameFree"
									label="Program (optional)"
									placeholder="e.g. M.Sc. Computer Science"
								/>
							</FieldGroup>
						</FieldSet>

						<FieldSet
							className={panelClass}
							data-form-step="2"
							onClick={() => setActiveStep(2)}
							onFocusCapture={() => setActiveStep(2)}
						>
							<div className="mb-3 flex items-center gap-3 text-lg font-bold text-[#0d2145]">
								<span className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-[#1238da]">
									<CalendarCheck2 className="size-5" strokeWidth={1.8} />
								</span>
								Outcome
							</div>
							<div className="grid gap-5 sm:grid-cols-2">
								<RHFInput
									control={form.control}
									name="intake"
									label="Intake"
									placeholder="e.g. WS2025 or SS2026"
								/>
								<RHFSelect<AcceptanceRecordFormInput>
									control={form.control}
									name="result"
									label="Result"
								>
									{admissionResults.map((v) => (
										<option key={v} value={v}>
											{admissionLabels[v]}
										</option>
									))}
								</RHFSelect>
							</div>

							<div className="mt-5 grid gap-5 lg:grid-cols-3">
								<RHFInput
									control={form.control}
									name="appliedDate"
									label="Applied on"
									type="date"
								/>
								<RHFInput
									control={form.control}
									name="responseDate"
									label="Response on"
									type="date"
								/>
								<RHFInput
									control={form.control}
									name="offerDate"
									label="Offer on"
									type="date"
								/>
							</div>

							<div className="mt-5">
								<RHFTextarea<AcceptanceRecordFormInput>
									control={form.control}
									name="notes"
									label="Notes"
									placeholder="Visa timeline, scholarship, course thoughts…"
								/>
							</div>
						</FieldSet>
					</div>
				</div>

				<BeforeSubmitPanel onActivate={() => setActiveStep(3)} />

				<div
					className="flex w-full flex-col gap-3 border-t border-slate-200/80 pt-6 sm:flex-row sm:items-center sm:justify-end"
					onFocusCapture={() => setActiveStep(3)}
				>
					<Button
						type="submit"
						size="lg"
						disabled={form.formState.isSubmitting}
						className="h-12 w-full rounded-xl bg-[#1238da] font-bold text-white hover:bg-[#0d2bb0] sm:w-auto sm:min-w-65"
					>
						{form.formState.isSubmitting ? (
							<span className="inline-flex items-center gap-2">
								<Loader2 className="size-4 animate-spin" />
								Submitting…
							</span>
						) : (
							<span className="inline-flex items-center gap-2">
								Submit acceptance record
								<Send className="size-4" strokeWidth={1.8} />
							</span>
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}

function CommunityFormSteps({
	activeStep,
	onStepClick
}: Readonly<{
	activeStep: number;
	onStepClick: (step: number) => void;
}>) {
	const steps = [
		{
			title: 'Academic & Profile',
			subtitle: 'Tell us about yourself'
		},
		{
			title: 'Application Details',
			subtitle: 'Where did you apply?'
		},
		{
			title: 'Outcome & Timeline',
			subtitle: 'Result and timeline'
		},
		{
			title: 'Review & Submit',
			subtitle: 'Confirm and submit'
		}
	] as const;

	return (
		<div className="hidden gap-5 border-b border-slate-200/80 pb-7 md:grid md:grid-cols-4">
			{steps.map(({ subtitle, title }, index) => {
				const active = activeStep === index;
				return (
					<button
						key={title}
						type="button"
						onClick={() => onStepClick(index)}
						className="group flex min-w-0 items-center gap-4 text-left"
					>
						<span
							className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
								active
									? 'bg-[#1238da] text-white'
									: 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-[#1238da]'
							}`}
						>
							{index + 1}
						</span>
						<span className="min-w-0 flex-1">
							<span
								className={`block truncate text-sm font-bold transition-colors ${
									active ? 'text-[#0d2145]' : 'text-slate-700'
								}`}
							>
								{title}
							</span>
							<span className="block truncate text-xs text-slate-500">
								{subtitle}
							</span>
						</span>
						{index < steps.length - 1 ? (
							<span className="hidden h-px flex-1 bg-slate-200 lg:block" />
						) : null}
					</button>
				);
			})}
		</div>
	);
}

function BeforeSubmitPanel({
	onActivate
}: Readonly<{ onActivate: () => void }>) {
	const items = [
		{
			title: 'Community verified',
			description: 'All records are reviewed before they are published.',
			icon: ShieldCheck
		},
		{
			title: 'Help others',
			description: 'Your data helps future students make informed decisions.',
			icon: BookOpen
		},
		{
			title: 'You stay in control',
			description: 'Choose anonymity and manage your own submissions.',
			icon: UserRound
		},
		{
			title: 'No spam',
			description: 'We do not allow promotions or misleading content.',
			icon: FileCheck2
		}
	] as const;

	return (
		<section
			className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6"
			data-form-step="3"
			onClick={onActivate}
			onFocusCapture={onActivate}
		>
			<div className="mb-6 flex items-start gap-4">
				<div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#1238da]">
					<ShieldCheck className="size-6" strokeWidth={1.8} />
				</div>
				<div>
					<h2 className="text-lg font-bold text-[#0d2145]">
						Before you submit
					</h2>
					<p className="text-muted-foreground mt-1 text-sm">
						Please make sure your information is correct. All submissions go
						through a review process.
					</p>
				</div>
			</div>
			<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
				{items.map(({ description, icon: Icon, title }) => (
					<div key={title} className="flex gap-3">
						<div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#1238da]">
							<Icon className="size-4" strokeWidth={1.8} />
						</div>
						<div>
							<p className="text-sm font-bold text-[#0d2145]">{title}</p>
							<p className="text-muted-foreground mt-1 text-xs leading-5">
								{description}
							</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
