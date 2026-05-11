import { toggleUserSuspendedFormAction } from "@/modules/admin/actions/user-admin.actions";
import { listAdminUsers } from "@/modules/admin/services/admin-stats.service";
import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Users | Admin",
};

export default async function AdminUsersPage() {
  const users = await listAdminUsers(120);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageIntro
        className="rounded-none border-0 bg-transparent p-0 shadow-none ring-0 md:p-0"
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Users" }]}
        title="Users & safety"
        description="Suspend abusive or spam accounts. Admins only — moderators should escalate instead of suspending."
      >
        <Link
          href="/admin"
          className="inline-flex h-11 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-[#0d2145] hover:bg-slate-50"
        >
          <ArrowLeft className="mr-2 size-4" strokeWidth={1.8} />
          Overview
        </Link>
      </DashboardPageIntro>

      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white  ring-1 ring-slate-900/5">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/90">
            <tr>
              <th className="px-4 py-3 font-semibold text-[#0d2145]">User</th>
              <th className="px-4 py-3 font-semibold text-[#0d2145]">Role</th>
              <th className="px-4 py-3 font-semibold text-[#0d2145]">Apps</th>
              <th className="px-4 py-3 font-semibold text-[#0d2145]">Joined</th>
              <th className="px-4 py-3 font-semibold text-[#0d2145]">Status</th>
              <th className="px-4 py-3 font-semibold text-[#0d2145]">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
              >
                <td className="px-4 py-3">
                  <div className="font-semibold text-[#0d2145]">{u.name}</div>
                  <div className="text-muted-foreground text-xs">{u.email}</div>
                </td>
                <td className="px-4 py-3 text-xs font-medium">{u.role}</td>
                <td className="px-4 py-3 tabular-nums">{u.applicationCount}</td>
                <td className="text-muted-foreground px-4 py-3 text-xs">
                  {u.createdAt.toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {u.suspendedAt ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-xs font-bold text-rose-700">
                      <ShieldAlert className="size-3.5" />
                      Suspended
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-emerald-700">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {u.role === "ADMIN" ? (
                    <span className="text-xs text-slate-400">—</span>
                  ) : (
                    <form action={toggleUserSuspendedFormAction}>
                      <input type="hidden" name="userId" value={u.id} />
                      <input
                        type="hidden"
                        name="suspend"
                        value={u.suspendedAt ? "false" : "true"}
                      />
                      <button
                        type="submit"
                        className={cn(
                          buttonVariants({
                            variant: u.suspendedAt ? "outline" : "destructive",
                            size: "sm",
                          }),
                          "h-9 rounded-lg font-semibold",
                        )}
                      >
                        {u.suspendedAt ? "Unsuspend" : "Suspend"}
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
