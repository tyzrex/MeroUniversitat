import type * as React from 'react';

/** Router shell for `/dashboard/*`. Full chrome lives in `(main)/layout.tsx`; onboarding stays outside that group. */
export default function DashboardRootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return children;
}
