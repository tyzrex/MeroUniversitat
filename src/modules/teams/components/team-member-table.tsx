'use client';

import { Badge } from '@/components/ui/badge';
import {
	removeMemberAction,
	updateMemberRoleAction
} from '@/modules/teams/actions/team-member.actions';
import { cn } from '@/lib/utils';
import {
	Crown,
	Loader2,
	MoreHorizontal,
	Shield,
	UserMinus,
	UserCog
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

type Member = {
	id: string;
	userId: string;
	role: string;
	joinedAt: Date | string;
	user: {
		id: string;
		name: string;
		email: string;
		image: string | null;
	};
};

const roleBadge: Record<
	string,
	{ label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
	OWNER: { label: 'Owner', variant: 'default' },
	ADMIN: { label: 'Admin', variant: 'secondary' },
	MEMBER: { label: 'Member', variant: 'outline' }
};

function formatJoined(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	const now = new Date();
	const diffMs = now.getTime() - d.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return 'Today';
	if (diffDays === 1) return 'Yesterday';
	if (diffDays < 7) return `${diffDays}d ago`;
	if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
	return d.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
	});
}

export function TeamMemberTable({
	teamId,
	members,
	currentUserId,
	isOwner,
	isAdmin
}: Readonly<{
	teamId: string;
	members: Member[];
	currentUserId: string;
	isOwner: boolean;
	isAdmin: boolean;
}>) {
	return (
		<div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03]">
			<div className="border-b border-slate-100 px-6 py-5">
				<h2 className="text-lg font-bold text-[#0d2145]">
					Members
					<span className="ml-2 text-sm font-semibold text-slate-400">
						{members.length}
					</span>
				</h2>
				<p className="mt-1 text-sm text-slate-500">
					People in this team can see and share applications on the same Kanban
					board.
				</p>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full min-w-[600px] text-left text-sm">
					<thead className="border-b border-slate-100 bg-slate-50/90">
						<tr>
							<th className="px-6 py-3 font-semibold text-[#0d2145]">Member</th>
							<th className="px-6 py-3 font-semibold text-[#0d2145]">Role</th>
							<th className="px-6 py-3 font-semibold text-[#0d2145]">Joined</th>
							{isOwner || isAdmin ? (
								<th className="px-6 py-3 text-right font-semibold text-[#0d2145]">
									Actions
								</th>
							) : null}
						</tr>
					</thead>
					<tbody>
						{members.map((m) => (
							<MemberRow
								key={m.id}
								teamId={teamId}
								member={m}
								currentUserId={currentUserId}
								isOwner={isOwner}
								isAdmin={isAdmin}
							/>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

function MemberRow({
	teamId,
	member,
	currentUserId,
	isOwner,
	isAdmin
}: Readonly<{
	teamId: string;
	member: Member;
	currentUserId: string;
	isOwner: boolean;
	isAdmin: boolean;
}>) {
	const router = useRouter();
	const [showActions, setShowActions] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	const isCurrentUser = member.userId === currentUserId;
	const isMemberOwner = member.role === 'OWNER';
	const canManage = (isOwner || isAdmin) && !isMemberOwner && !isCurrentUser;

	const badge = roleBadge[member.role] ?? roleBadge.MEMBER;

	const initials = member.user.name
		.split(/\s+/)
		.filter(Boolean)
		.map((w) => w[0])
		.slice(0, 2)
		.join('')
		.toUpperCase();

	function handleRemove() {
		setError(null);
		startTransition(async () => {
			const res = await removeMemberAction({
				teamId,
				memberId: member.userId
			});
			if (!res.ok) {
				setError(res.error);
				return;
			}
			setShowActions(false);
			router.refresh();
		});
	}

	function handleRoleToggle() {
		setError(null);
		const nextRole = member.role === 'ADMIN' ? 'MEMBER' : 'ADMIN';
		startTransition(async () => {
			const res = await updateMemberRoleAction({
				teamId,
				memberId: member.userId,
				role: nextRole
			});
			if (!res.ok) {
				setError(res.error);
				return;
			}
			setShowActions(false);
			router.refresh();
		});
	}

	return (
		<tr
			className={cn(
				'border-b border-slate-50 transition-colors last:border-0',
				isCurrentUser && 'bg-blue-50/40'
			)}
		>
			<td className="px-6 py-4">
				<div className="flex items-center gap-3">
					{member.user.image ? (
						<Image
							alt=""
							className="size-9 rounded-full object-cover ring-2 ring-slate-100"
							height={36}
							src={member.user.image}
							width={36}
						/>
					) : (
						<div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-xs font-bold text-slate-700 ring-2 ring-slate-100">
							{initials}
						</div>
					)}
					<div className="min-w-0">
						<p className="truncate font-semibold text-[#0d2145]">
							{member.user.name}
							{isCurrentUser ? (
								<span className="ml-1.5 text-xs font-medium text-slate-400">
									(you)
								</span>
							) : null}
						</p>
						<p className="truncate text-xs text-slate-500">
							{member.user.email}
						</p>
					</div>
				</div>
			</td>
			<td className="px-6 py-4">
				<Badge variant={badge.variant} className="font-medium">
					{isMemberOwner ? (
						<Crown className="mr-1 size-3" strokeWidth={2} />
					) : member.role === 'ADMIN' ? (
						<Shield className="mr-1 size-3" strokeWidth={2} />
					) : null}
					{badge.label}
				</Badge>
			</td>
			<td className="px-6 py-4 text-slate-500">
				{formatJoined(member.joinedAt)}
			</td>
			{isOwner || isAdmin ? (
				<td className="px-6 py-4 text-right">
					{canManage ? (
						<div className="relative inline-block">
							<button
								type="button"
								onClick={() => setShowActions(!showActions)}
								className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
							>
								{isPending ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									<MoreHorizontal className="size-4" />
								)}
							</button>
							{showActions ? (
								<>
									{/* Backdrop to close */}
									<div
										className="fixed inset-0 z-40"
										onClick={() => setShowActions(false)}
										onKeyDown={(e) => {
											if (e.key === 'Escape') setShowActions(false);
										}}
										role="button"
										tabIndex={-1}
										aria-label="Close actions menu"
									/>
									<div className="absolute right-0 z-50 mt-1 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
										{isOwner ? (
											<button
												type="button"
												onClick={handleRoleToggle}
												disabled={isPending}
												className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
											>
												<UserCog
													className="size-4 text-slate-400"
													strokeWidth={1.8}
												/>
												{member.role === 'ADMIN'
													? 'Demote to member'
													: 'Promote to admin'}
											</button>
										) : null}
										<button
											type="button"
											onClick={handleRemove}
											disabled={isPending}
											className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
										>
											<UserMinus className="size-4" strokeWidth={1.8} />
											Remove from team
										</button>
										{error ? (
											<p className="px-3 py-1.5 text-xs text-red-600">
												{error}
											</p>
										) : null}
									</div>
								</>
							) : null}
						</div>
					) : (
						<span className="text-xs text-slate-400">—</span>
					)}
				</td>
			) : null}
		</tr>
	);
}
