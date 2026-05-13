'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { UniversityRequestForm } from '@/modules/community/components/university-request-form';
import { Building2, Plus } from 'lucide-react';
import { useState } from 'react';

type RequestNoticeProps = {
	className?: string;
	title?: string;
	description?: string;
	triggerLabel?: string;
	initialName?: string;
};

export function UniversityRequestNotice({
	className,
	title = 'Can’t find your university?',
	description = 'If it’s missing from the directory, contribute it for review. New entries show as unverified until approved.',
	triggerLabel = 'Contribute a university',
	initialName
}: Readonly<RequestNoticeProps>) {
	const [open, setOpen] = useState(false);

	return (
		<section
			className={cn(
				'mt-6 flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/3 md:flex-row md:items-center md:justify-between md:p-6',
				className
			)}
		>
			<div className="flex items-start gap-4">
				<div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-[#4a52c8]">
					<Building2 className="size-5" strokeWidth={1.8} />
				</div>
				<div>
					<h2 className="text-lg font-bold text-[#0d2145]">{title}</h2>
					<p className="text-muted-foreground mt-1 text-sm leading-relaxed">
						{description}
					</p>
				</div>
			</div>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger
					render={
						<Button className="h-11 rounded-xl bg-[#0d2145] px-5 text-white hover:bg-[#1a3461]">
							<Plus className="size-4" strokeWidth={1.8} />
							{triggerLabel}
						</Button>
					}
				/>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Request a university</DialogTitle>
						<DialogDescription>
							Share the official name and city. We’ll verify the entry before it
							appears as approved.
						</DialogDescription>
					</DialogHeader>
					<UniversityRequestForm
						variant="dialog"
						showHeader={false}
						initialValues={initialName ? { name: initialName } : undefined}
					/>
				</DialogContent>
			</Dialog>
		</section>
	);
}
