"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { DashboardUser } from "@/modules/dashboard/components/dashboard-layout-client";
import {
  Building2,
  CalendarClock,
  CircleUser,
  ClipboardList,
  Columns3,
  Database,
  LayoutDashboard,
  Plane,
  Settings,
  Shield,
  UserSearch,
  Users,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { isDashboardNavActive } from "@/modules/dashboard/lib/dashboard-nav-active";
import { usePathname } from "next/navigation";

type NavItem = {
  title: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: string;
};

const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Applications",
    href: "/dashboard/applications",
    icon: UsersRound,
  },
  {
    title: "Kanban",
    href: "/dashboard/applications/kanban",
    icon: Columns3,
  },
  {
    title: "Universities",
    href: "/dashboard/universities",
    icon: Building2,
  },
  {
    title: "Teams",
    href: "/dashboard/teams",
    icon: Users,
  },
  {
    title: "Community Data",
    href: "/dashboard/community-data",
    icon: Database,
  },
  {
    title: "My contributions",
    href: "/dashboard/community-data/submissions",
    icon: ClipboardList,
  },
  {
    title: "Consular timeline",
    href: "/dashboard/timelines",
    icon: CalendarClock,
    badge: "New",
  },
  {
    title: "Visa journey",
    href: "/dashboard/visa-journey",
    icon: Plane,
  },
  {
    title: "Similar applicants",
    href: "/dashboard/similar-profiles",
    icon: UserSearch,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: CircleUser,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

function navButtonClass(isActive: boolean) {
  return cn(
    "h-10 gap-3 px-3 font-medium transition-colors",
    !isActive &&
      "text-sidebar-foreground/75 hover:bg-white/10 hover:text-sidebar-foreground",
    isActive &&
      "!bg-blue-500 !text-white hover:!bg-blue-600 hover:!text-white data-active:!bg-blue-500 data-active:!text-white",
  );
}

export function DashboardSidebar({
  user,
}: Readonly<{
  user: DashboardUser | null;
}>) {
  const pathname = usePathname();
  const displayName = user?.name ?? "Guest";
  const displayEmail = user?.email ?? "Sign in to continue";
  const showStaffNav =
    user?.role === "ADMIN" || user?.role === "MODERATOR";

  const staffNav = showStaffNav
    ? ([
        {
          title: "Admin",
          href: "/admin/community",
          icon: Shield,
        },
      ] as const)
    : ([] as const);
  return (
    <Sidebar
      className="border-sidebar-border border-r-0"
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarHeader className="gap-3 px-3 pt-4 pb-2">
        <Link
          className="flex items-center gap-1 rounded-md px-1 py-1 outline-none ring-sidebar-ring focus-visible:ring-2"
          href="/dashboard"
        >
          <Image
            alt="MeroUniversität"
            className="size-16 shrink-0 object-contain"
            height={160}
            priority
            src="/merologowhite.png"
            width={160}
          />
          <span className="text-sidebar-foreground truncate font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            Mero<span className="text-blue-500">Universität</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-2 pt-2">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {NAV_ITEMS.map((item) => {
                const active = isDashboardNavActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      className={navButtonClass(active)}
                      isActive={active}
                      render={<Link href={item.href} />}
                      tooltip={item.title}
                    >
                      <Icon className="shrink-0" strokeWidth={1.75} />
                      <span className="flex min-w-0 flex-1 items-center gap-2">
                        <span className="truncate">{item.title}</span>
                        {item.badge ? (
                          <span className="rounded-full bg-blue-400/25 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-100 group-data-[collapsible=icon]:hidden">
                            {item.badge}
                          </span>
                        ) : null}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              {staffNav.map((item) => {
                const active = isDashboardNavActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      className={navButtonClass(active)}
                      isActive={active}
                      render={<Link href={item.href} />}
                      tooltip={item.title}
                    >
                      <Icon className="shrink-0" strokeWidth={1.75} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="border-sidebar-border bg-sidebar-accent/40 rounded-lg border p-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
          <div className="flex items-center gap-3">
            {user?.image ? (
              <Image
                alt=""
                className="size-10 shrink-0 rounded-full object-cover ring-2 ring-white/10 group-data-[collapsible=icon]:size-8"
                height={40}
                src={user.image}
                width={40}
              />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white ring-2 ring-white/10 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:text-xs">
                {displayName.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">
                {displayName}
              </p>
              <p className="text-sidebar-foreground/65 truncate text-xs">
                {displayEmail}
              </p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
