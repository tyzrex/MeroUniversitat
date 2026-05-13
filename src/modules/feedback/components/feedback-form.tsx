'use client';

import {
	feedbackFormSchema,
	feedbackTypes,
	feedbackCategories,
	type FeedbackFormInput
} from '@/modules/feedback/schema/feedback-form-schema';
import { submitFeedbackAction } from '@/modules/feedback/actions/submit-feedback.action';
import { RHFInput } from '@/modules/shared/components/form/rhf-input';
import { RHFTextarea } from '@/modules/shared/components/form/rhf-textarea';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lightbulb, MessageSquareText, SendHorizonal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';

export function FeedbackForm({
	initialType
}: Readonly<{ initialType?: 'FEATURE_REQUEST' | 'COMMUNITY_FEEDBACK' }>) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const form = useForm<FeedbackFormInput>({
		resolver: zodResolver(feedbackFormSchema),
		defaultValues: {
			type: initialType ?? 'FEATURE_REQUEST',
			title: '',
			description: '',
			category: '',
			isAnonymous: false
		}
	});

	const selectedType = form.watch('type');

	function onSubmit(data: FeedbackFormInput) {
		startTransition(async () => {
			const res = await submitFeedbackAction(data);
			if (res.ok) {
				toast.success('Submitted! Thanks for your input.');
				form.reset();
				router.refresh();
			} else {
				toast.error(res.error);
			}
		});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-6"
			>
				<div className="flex flex-wrap gap-3">
					{feedbackTypes.map((t) => {
						const isActive = selectedType === t;
						const icons: Record<string, typeof Lightbulb> = {
							FEATURE_REQUEST: Lightbulb,
							COMMUNITY_FEEDBACK: MessageSquareText,
							BUG_REPORT: MessageSquareText,
							OTHER: MessageSquareText
						};
						const Icon = icons[t] ?? MessageSquareText;
						return (
							<button
								key={t}
								type="button"
								onClick={() => form.setValue('type', t as any)}
								className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
									isActive
										? 'bg-[#4a52c8] text-white shadow-md'
										: 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
								}`}
							>
								<Icon className="size-4" strokeWidth={1.8} />
								{t === 'FEATURE_REQUEST'
									? 'Feature'
									: t === 'COMMUNITY_FEEDBACK'
										? 'Feedback'
										: t === 'BUG_REPORT'
											? 'Bug'
											: 'Other'}
							</button>
						);
					})}
				</div>

				<RHFInput
					control={form.control}
					name="title"
					label="Title"
					placeholder="Summarise your idea in one line"
				/>

				<RHFTextarea
					control={form.control}
					name="description"
					label="Description"
					placeholder="Tell us more about your suggestion, feedback, or issue..."
					rows={5}
				/>

				<div className="flex flex-wrap gap-4">
					<div className="min-w-[200px] flex-1">
						<label className="mb-1.5 block text-sm font-semibold text-slate-700">
							Category
						</label>
						<select
							{...form.register('category')}
							className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 ring-[#4a52c8]/30 outline-none focus-visible:ring-2"
						>
							<option value="">General</option>
							{feedbackCategories.map((c) => (
								<option key={c} value={c}>
									{c.charAt(0).toUpperCase() + c.slice(1)}
								</option>
							))}
						</select>
					</div>

					<div className="flex items-end">
						<label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300">
							<input
								type="checkbox"
								{...form.register('isAnonymous')}
								className="size-4 rounded border-slate-300 text-[#4a52c8] accent-[#4a52c8]"
							/>
							Submit anonymously
						</label>
					</div>
				</div>

				<div className="flex justify-end border-t border-slate-100 pt-6">
					<Button
						type="submit"
						disabled={isPending}
						className="h-11 gap-2 rounded-xl bg-[#4a52c8] px-6 font-semibold text-white hover:bg-[#3a42b8]"
					>
						<SendHorizonal className="size-4" strokeWidth={1.8} />
						{isPending ? 'Submitting...' : 'Submit'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
