import {
	DashboardBannerSkeleton,
	VisaJourneySectionSkeleton
} from '@/modules/dashboard/components/dashboard-route-skeletons';

export default function VisaJourneyLoading() {
	return (
		<div className="flex flex-col gap-8">
			<DashboardBannerSkeleton />
			<VisaJourneySectionSkeleton />
		</div>
	);
}
