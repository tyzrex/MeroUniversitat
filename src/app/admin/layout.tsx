import { AdminShell } from '@/modules/admin/components/admin-shell';
import { requireModeratorSession } from '@/modules/admin/server/guards';
import type * as React from 'react';

export default async function AdminLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	await requireModeratorSession();
	return <AdminShell>{children}</AdminShell>;
}
