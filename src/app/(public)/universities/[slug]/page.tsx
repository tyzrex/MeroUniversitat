import { UniversityDetailView } from '@/modules/community/components/university-detail-view';
import { getUniversityApplicationStats } from '@/modules/community/services/university-application-stats.service';
import { getUniversityBySlug } from '@/modules/community/services/university.service';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({
	params
}: Readonly<{
	params: Promise<{ slug: string }>;
}>): Promise<Metadata> {
	const { slug } = await params;
	const uni = await getUniversityBySlug(slug);
	if (!uni) {
		return { title: 'University | MeroUniversität' };
	}
	return {
		title: `${uni.name} | MeroUniversität`,
		description:
			uni.description ??
			`Applications and details for ${uni.name} in ${uni.city}.`
	};
}

export default async function UniversityDetailPage({
	params
}: Readonly<{
	params: Promise<{ slug: string }>;
}>) {
	const { slug } = await params;
	const uni = await getUniversityBySlug(slug);
	if (!uni) {
		notFound();
	}

	const session = await auth.api.getSession({ headers: await headers() });
	const stats = await getUniversityApplicationStats(
		uni.id,
		session?.user?.id ?? null
	);

	return (
		<UniversityDetailView
			uni={uni}
			stats={stats}
			backHref="/universities"
			backLabel="Back to universities"
			isSignedIn={Boolean(session?.user?.id)}
		/>
	);
}
