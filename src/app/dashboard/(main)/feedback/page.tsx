import { auth } from '@/lib/auth';
import { FeedbackForm } from '@/modules/feedback/components/feedback-form';
import { FeedbackList } from '@/modules/feedback/components/feedback-list';
import { listFeedbackForUser } from '@/modules/feedback/services/feedback.service';
import {
	dashboardOutlineActionClass,
	dashboardPrimaryActionClass
} from '@/modules/dashboard/lib/dashboard-header-actions';
import { DashboardPageIntro } from '@/modules/dashboard/components/dashboard-page-intro';
import { headers } from 'next/headers';
import { ExternalLink, Lightbulb, MessageSquareText } from 'lucide-react';
import Link from 'next/link';

import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Feedback & feature requests | MeroUniversität',
	description:
		'Submit feedback, feature requests, or bug reports for the platform.'
};

export default async function DashboardFeedbackPage() {
	const session = await auth.api.getSession({ headers: await headers() });
	const userId = session?.user?.id;

	const userFeedback = userId ? await listFeedbackForUser(userId) : [];

	return (
		<div className="flex min-w-0 flex-col gap-6 pb-12">
			<DashboardPageIntro
				className="rounded-none border-0 bg-transparent p-0 shadow-none ring-0 md:p-0"
				crumbs={[{ label: 'Feedback' }]}
				title="Feature requests & feedback"
				description="Share your ideas, report issues, or tell us what you think about the platform. We read everything."
			>
				<Link className={dashboardOutlineActionClass()} href="/feedback">
					<ExternalLink className="size-4" strokeWidth={1.8} />
					Public page
				</Link>
				<Link
					className={dashboardPrimaryActionClass()}
					href="/dashboard/feedback"
				>
					<Lightbulb className="size-4" strokeWidth={1.8} />
					Submit idea
				</Link>
			</DashboardPageIntro>

			<div className="grid gap-8 lg:grid-cols-5">
				<div className="lg:col-span-3">
					<div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03] md:p-8">
						<div className="mb-6 flex items-center gap-3">
							<div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
								<Lightbulb className="size-5" strokeWidth={1.8} />
							</div>
							<div>
								<h2 className="font-bold text-[#0d2145]">Submit your input</h2>
								<p className="text-muted-foreground text-sm">
									All submissions are reviewed by the team.
								</p>
							</div>
						</div>
						<FeedbackForm />
					</div>
				</div>

				<div className="lg:col-span-2">
					<div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03] md:p-8">
						<div className="mb-6 flex items-center gap-3">
							<div className="flex size-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
								<MessageSquareText className="size-5" strokeWidth={1.8} />
							</div>
							<div>
								<h2 className="font-bold text-[#0d2145]">My submissions</h2>
								<p className="text-muted-foreground text-sm">
									Track the status of your feedback.
								</p>
							</div>
						</div>
						{userId ? (
							<FeedbackList items={userFeedback as any} />
						) : (
							<div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
								<p className="text-sm text-slate-500">
									<Link
										href="/sign-in"
										className="font-semibold text-[#4a52c8] hover:underline"
									>
										Sign in
									</Link>{' '}
									to track your submissions.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
