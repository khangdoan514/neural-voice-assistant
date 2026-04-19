export function activeTabForPathname(pathname) {
  if (pathname === "/admin") return "welcome"
  if (pathname === "/admin/home") return "home"
  if (pathname === "/admin/settings") return "settings"
  if (pathname === "/admin/dashboard" || pathname === "/admin/conversation") return "conversations"
  return "comingSoon"
}
