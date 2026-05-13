import { FeedbackForm } from '@/modules/feedback/components/feedback-form';
import { FeedbackList } from '@/modules/feedback/components/feedback-list';
import { listFeedbackAdmin } from '@/modules/feedback/services/feedback.service';
import { DashboardBannerHero } from '@/modules/shared/components/dashboard-banner-hero';
import { Container } from '@/modules/shared/components/container';
import { getOptionalSession } from '@/modules/shared/server/session';
import { Lightbulb, MessageSquareText } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Feedback & feature requests | MeroUniversität',
	description:
		'Share your ideas, report issues, or tell us what you think about the platform.'
};

export default async function FeedbackPublicPage() {
	const session = await getOptionalSession();
	const isLoggedIn = !!session?.user;

	const acknowledgedFeedback = await listFeedbackAdmin({
		status: 'ACKNOWLEDGED'
	});

	return (
		<main className="bg-gradient-to-b from-slate-50 via-white to-slate-50/80 pt-6 pb-24">
			<Container>
				<DashboardBannerHero
					rootCrumb={{ label: 'Home', href: '/' }}
					crumbs={[{ label: 'Feedback' }]}
					eyebrow="Community feedback"
					title="Share your ideas & feedback"
					description={
						<>
							Help shape MeroUniversität. Submit a feature request, share
							community feedback, or report an issue. We review every
							submission.
						</>
					}
				/>

				<div className="grid gap-8 lg:grid-cols-5">
					<div className="lg:col-span-3">
						<div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03] md:p-8">
							<div className="mb-6 flex items-center gap-3">
								<div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
									<Lightbulb className="size-5" strokeWidth={1.8} />
								</div>
								<div>
									<h2 className="font-bold text-[#0d2145]">
										Submit your input
									</h2>
									<p className="text-muted-foreground text-sm">
										No account needed — anonymous submissions welcome.
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
									<h2 className="font-bold text-[#0d2145]">
										Acknowledged feedback
									</h2>
									<p className="text-muted-foreground text-sm">
										Items the team has reviewed and responded to.
									</p>
								</div>
							</div>
							<FeedbackList items={acknowledgedFeedback as any} />
						</div>
					</div>
				</div>
			</Container>
		</main>
	);
}
