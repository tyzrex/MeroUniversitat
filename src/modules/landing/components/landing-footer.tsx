import Link from 'next/link';
import Image from 'next/image';
import { Mail } from 'lucide-react';
import { Container } from '@/modules/shared/components/container';

const FOOTER_COLS = [
	{
		title: 'Platform',
		links: [
			{ label: 'Universities', href: '/universities' },
			{ label: 'Programs', href: '/universities' },
			{ label: 'Community', href: '/community' },
			{ label: 'Timeline', href: '/dashboard/analytics' },
			{ label: 'Dashboard', href: '/dashboard' }
		]
	},
	{
		title: 'Resources',
		links: [
			{ label: 'Documents', href: '/community' },
			{ label: 'SOP Samples', href: '/community' },
			{ label: 'Guides', href: '/community' },
			{ label: 'Checklists', href: '/community' }
		]
	},
	{
		title: 'Company',
		links: [
			{ label: 'About Us', href: '/' },
			{ label: 'Contact', href: '/' },
			{ label: 'Privacy Policy', href: '/' },
			{ label: 'Terms of Service', href: '/' }
		]
	}
] as const;

export function LandingFooter() {
	return (
		<footer className="border-t border-slate-200 bg-white">
			<Container className="py-12">
				<div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
					{/* Brand */}
					<div className="lg:col-span-2">
						<div className="flex items-center gap-2.5">
							<Image
								src="/merounilogo.png"
								alt="MeroUniversität"
								width={80}
								height={80}
								className="size-[80px] object-contain"
							/>
							<span className="font-bold text-[#0d2145]">MeroUniversität</span>
						</div>
						<p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
							A community-driven platform making Germany applications
							transparent and smarter for Nepali students.
						</p>
						{/* Social */}
						<div className="mt-5 flex gap-2.5">
							{[Mail].map((Icon, i) => (
								<a
									key={i}
									href="#"
									className="flex size-8 items-center justify-center rounded border border-slate-200 text-slate-400 transition hover:border-[#0d2145] hover:text-[#0d2145]"
									aria-label="Social link"
								>
									<Icon className="size-4" />
								</a>
							))}
						</div>
					</div>

					{/* Column links */}
					{FOOTER_COLS.map((col) => (
						<div key={col.title}>
							<h4 className="text-sm font-bold text-[#0d2145]">{col.title}</h4>
							<ul className="mt-4 space-y-2">
								{col.links.map((l) => (
									<li key={l.label}>
										<Link
											href={l.href}
											className="text-sm text-slate-500 transition hover:text-[#0d2145]"
										>
											{l.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Bottom bar */}
				<div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-8 text-sm text-slate-400 sm:flex-row sm:justify-between">
					<span>
						© {new Date().getFullYear()} MeroUniversität. All rights reserved.
					</span>
					<span>Made with ❤️ for Nepali students</span>
				</div>
			</Container>
		</footer>
	);
}
