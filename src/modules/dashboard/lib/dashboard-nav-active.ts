/**
 * Sidebar active state: avoid highlighting both "Applications" and "Kanban"
 * when only one route should be active (prefix matching is ambiguous).
 */
export function isDashboardNavActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  if (href === "/dashboard/applications/kanban") {
    return pathname.startsWith("/dashboard/applications/kanban");
  }

  if (href === "/dashboard/applications") {
    return (
      pathname.startsWith("/dashboard/applications") &&
      !pathname.startsWith("/dashboard/applications/kanban")
    );
  }

  if (href === "/dashboard/community-data/submissions") {
    return pathname.startsWith("/dashboard/community-data/submissions");
  }

  if (href === "/dashboard/community-data") {
    return (
      pathname.startsWith("/dashboard/community-data") &&
      !pathname.startsWith("/dashboard/community-data/submissions")
    );
  }

  if (href.startsWith("/admin")) {
    return pathname.startsWith("/admin");
  }

  if (href === "/dashboard/profile") {
    return pathname === "/dashboard/profile";
  }

  if (href.startsWith("/dashboard")) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
