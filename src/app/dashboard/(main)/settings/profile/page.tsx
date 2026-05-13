import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Redirecting to profile',
	description: 'Profile settings have moved to the profile page.',
	robots: { index: false, follow: false }
};

/** Legacy route — profile editing lives at `/dashboard/profile`. */
export default function SettingsProfileRedirectPage() {
	redirect('/dashboard/profile');
}
