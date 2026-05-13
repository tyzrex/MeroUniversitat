import type { Metadata } from 'next';
import { LandingFeatures } from '@/modules/landing/components/landing-features';
import { LandingHero } from '@/modules/landing/components/landing-hero';

export const metadata: Metadata = {
	title: 'MeroUniversität — Track applications to German universities',
	description:
		'Track university applications, compare admission outcomes, and connect with peers applying to German universities.',
	openGraph: {
		title: 'MeroUniversität — Track applications to German universities',
		description:
			'Track university applications, compare admission outcomes, and connect with peers applying to German universities.'
	}
};

export default function Home() {
	return (
		<>
			<LandingHero />
			<LandingFeatures />
		</>
	);
}
