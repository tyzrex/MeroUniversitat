import { CommunityDataFormSkeleton } from '@/modules/dashboard/components/dashboard-route-skeletons';
import {
	CommunityDataHero,
	CommunityDataPageWrap
} from '@/modules/community/components/community-data-hero';

export default function CommunityDataLoading() {
	return (
		<div className="flex flex-col gap-8 pb-12">
			<CommunityDataHero variant="dashboard" />
			<CommunityDataPageWrap>
				<CommunityDataFormSkeleton />
			</CommunityDataPageWrap>
		</div>
	);
}
