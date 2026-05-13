import Link from 'next/link';
import {
	Search,
	Users,
	LayoutGrid,
	TrendingUp,
	FolderOpen
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Container } from '@/modules/shared/components/container';

type Feature = {
	Icon: LucideIcon;
	title: string;
	desc: string;
	href: string;
	cta: string;
	bg: string;
	iconColor: string;
	ctaColor: string;
};

const FEATURES: Feature[] = [
	{
		Icon: Search,
		title: 'University Explorer',
		desc: 'Search and filter 150+ German universities and thousands of programs.',
		href: '/universities',
		cta: 'Explore',
		bg: 'bg-indigo-50',
		iconColor: 'text-indigo-600',
		ctaColor: 'text-indigo-600'
	},
	{
		Icon: Users,
		title: 'Real Student Profiles',
		desc: 'See where students with similar profiles got accepted. Fully anonymised.',
		href: '/community',
		cta: 'View Profiles',
		bg: 'bg-emerald-50',
		iconColor: 'text-emerald-600',
		ctaColor: 'text-emerald-600'
	},
	{
		Icon: LayoutGrid,
		title: 'Application Tracker',
		desc: 'Track your applications from start to offer letter with our Kanban board.',
		href: '/sign-up',
		cta: 'Track Now',
		bg: 'bg-cyan-50',
		iconColor: 'text-cyan-600',
		ctaColor: 'text-cyan-600'
	},
	{
		Icon: TrendingUp,
		title: 'Timeline Insights',
		desc: 'Get average timelines for uni-assist reviews, offers, visa & more.',
		href: '/dashboard/analytics',
		cta: 'See Insights',
		bg: 'bg-purple-50',
		iconColor: 'text-purple-600',
		ctaColor: 'text-purple-600'
	},
	{
		Icon: FolderOpen,
		title: 'Resources & Docs',
		desc: 'Access SOP samples, CV templates, checklists and much more.',
		href: '/community',
		cta: 'Browse Resources',
		bg: 'bg-sky-50',
		iconColor: 'text-sky-600',
		ctaColor: 'text-sky-600'
	}
];

export function LandingFeatures() {
	return (
		<section className="bg-slate-50/60 py-16 md:py-20">
			<Container>
				<div className="mx-auto max-w-2xl space-y-6 text-center">
					<h2 className="text-3xl font-black tracking-tight md:text-4xl">
						Everything you need for your Germany journey
					</h2>
					<p className="mt-3 text-slate-500">
						Powerful tools and real data to help you apply smarter and achieve
						your dreams.
					</p>
				</div>

				<div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
					{FEATURES.map(
						({ Icon, title, desc, href, cta, bg, iconColor, ctaColor }) => (
							<div
								key={title}
								className="group flex flex-col space-y-3 rounded-lg border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
							>
								<div
									className={`mb-4 inline-flex size-14 items-center justify-center rounded-full border border-slate-100 ${bg}`}
								>
									<Icon className={`size-6 ${iconColor}`} />
								</div>
								<h3 className="text-[16px] font-black">{title}</h3>
								<p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-slate-500">
									{desc}
								</p>
								<Link
									href={href}
									className={`mt-4 inline-flex items-center gap-1 text-[14px] font-black text-blue-600 hover:underline`}
								>
									{cta} →
								</Link>
							</div>
						)
					)}
				</div>
			</Container>
		</section>
	);
}
