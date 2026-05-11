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
        crumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Users" },
        ]}
        title="Users & safety"
        description="Suspend abusive or spam accounts. Admins only — moderators should escalate instead of suspending."
      >
        <Link
          href="/admin"
          className="inline-flex h-11 items-center rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground hover:bg-muted"
        >
          <ArrowLeft className="mr-2 size-4" strokeWidth={1.8} />
          Overview
        </Link>
      </DashboardPageIntro>

      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm ring-1 ring-border/40">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-muted/60">
            <tr>
              <th className="px-4 py-3 font-semibold text-foreground">User</th>
              <th className="px-4 py-3 font-semibold text-foreground">Role</th>
              <th className="px-4 py-3 font-semibold text-foreground">Apps</th>
              <th className="px-4 py-3 font-semibold text-foreground">Joined</th>
              <th className="px-4 py-3 font-semibold text-foreground">Status</th>
              <th className="px-4 py-3 font-semibold text-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-border last:border-0 hover:bg-muted/50"
              >
                <td className="px-4 py-3">
                  <div className="font-semibold text-foreground">{u.name}</div>
                  <div className="text-muted-foreground text-xs">{u.email}</div>
                </td>
                <td className="px-4 py-3 text-xs font-medium">{u.role}</td>
                <td className="px-4 py-3 tabular-nums">{u.applicationCount}</td>
                <td className="text-muted-foreground px-4 py-3 text-xs">
                  {u.createdAt.toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {u.suspendedAt ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-1 text-xs font-bold text-rose-700 dark:text-rose-300">
                      <ShieldAlert className="size-3.5" />
                      Suspended
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {u.role === "ADMIN" ? (
                    <span className="text-xs text-muted-foreground">—</span>
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
