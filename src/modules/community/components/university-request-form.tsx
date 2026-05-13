'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { submitUniversityRequestAction } from '@/modules/community/actions/submit-university-request.action';
import {
	universityRequestFormSchema,
	type UniversityRequestFormInput
} from '@/modules/community/schema/university-request-form-schema';
import { RHFInput, RHFTextarea } from '@/modules/shared/components/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Link2, Loader2, MapPin, Send } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const panelClass =
	'rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03]';

const dialogClass =
	'rounded-2xl border border-transparent bg-transparent p-0 shadow-none ring-0';

const baseDefaults: UniversityRequestFormInput = {
	name: '',
	city: '',
	website: '',
	programUrl: '',
	notes: ''
};

export type UniversityRequestSuccessPayload = {
	id: string;
	slug: string;
	verificationStatus: string;
	alreadyExists: boolean;
	name: string;
	city: string;
};

export function UniversityRequestForm({
	variant = 'panel',
	showHeader = true,
	initialValues,
	onSuccess
}: Readonly<{
	variant?: 'panel' | 'dialog';
	showHeader?: boolean;
	initialValues?: Partial<UniversityRequestFormInput>;
	/** When set (e.g. embedded in `UniversityPicker`), invoked after a successful submit so the parent can close UI and apply the selection. */
	onSuccess?: (data: UniversityRequestSuccessPayload) => void;
}>) {
	const form = useForm<UniversityRequestFormInput>({
		resolver: zodResolver(universityRequestFormSchema),
		defaultValues: {
			...baseDefaults,
			...initialValues
		},
		mode: 'onBlur'
	});

	const [submitError, setSubmitError] = useState<string | null>(null);
	const [done, setDone] = useState<{
		slug: string;
		verificationStatus: string;
		alreadyExists: boolean;
	} | null>(null);

	useEffect(() => {
		if (!initialValues) return;
		form.reset({
			...baseDefaults,
			...initialValues
		});
	}, [
		form,
		initialValues?.name,
		initialValues?.city,
		initialValues?.website,
		initialValues?.programUrl,
		initialValues?.notes
	]);

	async function onSubmit(values: UniversityRequestFormInput) {
		setSubmitError(null);
		setDone(null);
		const result = await submitUniversityRequestAction(values);
		if (!result.ok) {
			setSubmitError(result.error);
			return;
		}
		const name = values.name.trim();
		const city = values.city.trim();
		if (onSuccess) {
			onSuccess({
				id: result.data.id,
				slug: result.data.slug,
				verificationStatus: result.data.verificationStatus,
				alreadyExists: result.data.alreadyExists,
				name,
				city
			});
			if (!result.data.alreadyExists) {
				form.reset();
			}
			return;
		}
		setDone({
			slug: result.data.slug,
			verificationStatus: result.data.verificationStatus,
			alreadyExists: result.data.alreadyExists
		});
		if (!result.data.alreadyExists) {
			form.reset();
		}
	}

	return (
		<section className={variant === 'panel' ? panelClass : dialogClass}>
			{showHeader ? (
				<div className="mb-6 flex flex-col gap-2">
					<p className="text-xs font-semibold tracking-[0.18em] text-blue-500 uppercase">
						Missing a university?
					</p>
					<h2 className="text-2xl font-bold text-[#0d2145]">
						Request an addition
					</h2>
					<p className="text-muted-foreground text-sm">
						Requests appear as unverified in the directory until an admin
						reviews them.
					</p>
				</div>
			) : null}

			{done ? (
				<Alert
					className={
						done.alreadyExists
							? 'rounded-2xl border-amber-200/80 bg-amber-50 text-amber-950'
							: 'rounded-2xl border-emerald-200 bg-emerald-50 text-emerald-950'
					}
				>
					<AlertTitle>
						{done.alreadyExists
							? 'Already in the directory'
							: 'Request received'}
					</AlertTitle>
					<AlertDescription>
						{done.alreadyExists
							? 'That university is already listed. You can review the profile below.'
							: 'Thanks for helping the community. Your request will show up as unverified until approved.'}
						<div className="mt-2">
							<Link
								className="text-sm font-semibold underline underline-offset-4"
								href={`/universities/${done.slug}`}
							>
								Open university page
							</Link>
						</div>
					</AlertDescription>
				</Alert>
			) : null}

			{submitError ? (
				<Alert variant="destructive" className="rounded-2xl">
					<AlertTitle>Could not submit</AlertTitle>
					<AlertDescription>{submitError}</AlertDescription>
				</Alert>
			) : null}

			<Form {...form}>
				<form className="mt-6 space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
					<div className="grid gap-5 lg:grid-cols-2">
						<RHFInput<UniversityRequestFormInput>
							control={form.control}
							name="name"
							label="University name"
							placeholder="e.g. RWTH Aachen University"
							icon={Building2}
						/>
						<RHFInput<UniversityRequestFormInput>
							control={form.control}
							name="city"
							label="City"
							placeholder="e.g. Aachen"
							icon={MapPin}
						/>
					</div>

					<div className="grid gap-5 lg:grid-cols-2">
						<RHFInput<UniversityRequestFormInput>
							control={form.control}
							name="website"
							label="Official website (optional)"
							description="This helps us verify the request quickly."
							placeholder="https://www.example.edu"
							icon={Link2}
						/>
						<RHFInput<UniversityRequestFormInput>
							control={form.control}
							name="programUrl"
							label="Program page (optional)"
							placeholder="https://www.example.edu/program"
							icon={Link2}
						/>
					</div>

					<RHFTextarea<UniversityRequestFormInput>
						control={form.control}
						name="notes"
						label="Notes for reviewers (optional)"
						placeholder="Anything helpful for verification?"
						rows={4}
					/>

					<div className="flex flex-wrap items-center gap-4">
						<Button
							type="submit"
							disabled={form.formState.isSubmitting}
							className="h-11 rounded-xl bg-[#0d2145] px-6 font-semibold text-white hover:bg-[#1a3461]"
						>
							{form.formState.isSubmitting ? (
								<Loader2 className="size-4 animate-spin" />
							) : (
								<Send className="size-4" />
							)}
							Submit request
						</Button>
						<p className="text-muted-foreground text-xs">
							We review requests daily. Approved universities become verified.
						</p>
					</div>
				</form>
			</Form>
		</section>
	);
}
