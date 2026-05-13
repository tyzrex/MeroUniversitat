import {
	CommunityDataHero,
	CommunityDataPageWrap
} from '@/modules/community/components/community-data-hero';
import { CommunityDataFormSkeleton } from '@/modules/dashboard/components/dashboard-route-skeletons';
import { CommunityDataFormSection } from './community-data-form-section';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Community acceptance data | MeroUniversität',
	description:
		'Share your admission outcome to help the community benchmark realistic profiles.'
};

export default function DashboardCommunityDataPage() {
	return (
		<div className="flex flex-col gap-8 pb-12">
			<CommunityDataHero variant="dashboard" />
			<CommunityDataPageWrap>
				<Suspense fallback={<CommunityDataFormSkeleton />}>
					<CommunityDataFormSection />
				</Suspense>
			</CommunityDataPageWrap>
		</div>
	);
}
