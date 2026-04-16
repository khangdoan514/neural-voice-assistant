export function activeTabForPathname(pathname) {
  if (pathname === "/admin") return "welcome"
  if (pathname === "/admin/home") return "home"
  if (pathname === "/admin/support/about") return "about"
  if (pathname === "/admin/support/contact") return "contact"
  if (pathname === "/admin/settings") return "settings"
  if (pathname === "/admin/dashboard" || pathname === "/admin/conversation") return "conversations"
  return "comingSoon"
}
