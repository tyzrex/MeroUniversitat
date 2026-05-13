import { buttonVariants } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { UserAccountMenu } from '@/modules/shared/components/user-account-menu';
import { cn } from '@/lib/utils';
import { Bell } from 'lucide-react';
import { headers } from 'next/headers';
import Link from 'next/link';

export default async function LandingHeaderProfile() {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	return (
		<>
			{!session?.user ? (
				<div className="ml-auto hidden shrink-0 items-center gap-2 lg:flex">
					<Link
						href="/sign-in"
						className={cn(
							buttonVariants({ variant: 'outline', size: 'lg' }),
							'font-bold'
						)}
					>
						Sign in
					</Link>
					<Link
						href="/sign-up"
						className={cn(
							buttonVariants({ variant: 'default', size: 'lg' }),
							'font-bold'
						)}
					>
						Get Started
					</Link>
				</div>
			) : (
				<div className="ml-auto flex shrink-0 items-center gap-3">
					<button
						type="button"
						className="relative flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-600"
						aria-label="Notifications"
					>
						<Bell className="size-5" strokeWidth={1.8} />
						<span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 ring-2 ring-white" />
					</button>
					<UserAccountMenu
						user={{
							id: session.user.id,
							name: session.user.name,
							email: session.user.email,
							image: session.user.image
						}}
					/>
				</div>
			)}
		</>
	);
}
