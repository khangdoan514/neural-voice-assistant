import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  HomeIcon,
  Squares2X2Icon,
  WrenchIcon,
  CubeIcon,
  LifebuoyIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  SunIcon,
  ComputerDesktopIcon,
  LightBulbIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  DocumentDuplicateIcon,
  CloudIcon,
  MagnifyingGlassIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline"

const Sidebar = ({ onLogout, userProfile }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [openMenus, setOpenMenus] = useState({
    Services: false,
    Products: false,
    Support: false,
  })
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDesktopHovered, setIsDesktopHovered] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentUser, setCurrentUser] = useState({
    name: "Admin User",
    email: "admin@etpsupply.com",
    avatar: "",
  })
  const profileMenuRef = useRef(null)

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => {
      const willOpen = !prev[menu]
      return {
        Services: false,
        Products: false,
        Support: false,
        [menu]: willOpen,
      }
    })
  }

  const navItems = [
    { to: "/admin/home", label: "Home", icon: HomeIcon },
    { to: "/admin/dashboard", label: "Dashboard", icon: Squares2X2Icon },
    {
      label: "Services",
      icon: WrenchIcon,
      children: [
        { to: "/admin/services/construction", label: "New Farm Construction", icon: BuildingOfficeIcon },
        { to: "/admin/services/retro", label: "Retro Older Houses", icon: ArrowPathIcon },
        { to: "/admin/services/shop", label: "In-House Shop", icon: Cog6ToothIcon },
        { to: "/admin/services/repair", label: "On-Farm Repair", icon: WrenchIcon },
      ],
    },
    {
      label: "Products",
      icon: CubeIcon,
      children: [
        { to: "/admin/products/feeding", label: "Feeding Systems", icon: CubeIcon },
        { to: "/admin/products/watering", label: "Watering Systems", icon: CubeIcon },
        { to: "/admin/products/heating", label: "Heating Systems", icon: SunIcon },
        { to: "/admin/products/cooling", label: "Cooling Systems", icon: CloudIcon },
        { to: "/admin/products/fans", label: "Fans", icon: WrenchIcon },
        { to: "/admin/products/controllers", label: "Controllers", icon: ComputerDesktopIcon },
        { to: "/admin/products/lighting", label: "LED Lighting", icon: LightBulbIcon },
        { to: "/admin/products/cleanout", label: "Cleanout Equipment", icon: SparklesIcon },
      ],
    },
    {
      label: "Support",
      icon: LifebuoyIcon,
      children: [
        { to: "/admin/support/about", label: "About Us", icon: DocumentTextIcon },
        { to: "/admin/support/contact", label: "Contact", icon: EnvelopeIcon },
        { to: "/admin/support/request", label: "Submit a Request", icon: DocumentDuplicateIcon },
        { to: "/admin/support/privacy", label: "Privacy Policy", icon: ShieldCheckIcon },
      ],
    },
  ]

  const isOnWelcome = location.pathname === "/admin"

  const isActive = (path) => {
    if (isOnWelcome) return false
    return location.pathname === path
  }

  const closeMobileMenu = () => setIsMobileOpen(false)

  const initials = currentUser.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const isDesktopExpanded = isDesktopHovered

  const renderProfileMenu = () => (
    <div ref={profileMenuRef} className="mt-4 relative">
      <button
        onClick={() => setIsProfileMenuOpen((prev) => !prev)}
        className={`w-full flex items-center gap-3 ${!isDesktopExpanded
            ? "justify-center px-0 py-1.5 bg-transparent border-0 rounded-none"
            : "px-3 py-2.5 bg-charcoal/80 border border-rust/25 rounded-lg hover:border-rust/50 transition-all"
          }`}
        title={!isDesktopExpanded ? currentUser.name : undefined}
      >
        <div className="relative">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-10 w-10 rounded-full object-cover border border-rust/30"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-rust/20 border border-rust/30 text-rust font-label font-bold flex items-center justify-center">
              {initials}
            </div>
          )}
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border border-charcoal" />
        </div>
        {isDesktopExpanded && (
          <>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-sm font-label font-semibold text-nav-text truncate">{currentUser.name}</p>
              <p className="text-xs text-muted truncate">{currentUser.email}</p>
            </div>
            <ChevronDownIcon className={`h-4 w-4 text-muted transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`} />
          </>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isProfileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 right-0 bottom-full mb-2 bg-charcoal/95 backdrop-blur-sm border border-rust/25 rounded-lg overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          >
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18, delay: 0.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setIsProfileMenuOpen(false)
                navigate("/admin/settings")
              }}
              className="group w-full text-left px-3 py-2 text-sm text-nav-text hover:bg-rust/20 hover:text-rust transition-colors"
            >
              <span className="inline-flex items-center gap-2 transition-transform duration-200 group-hover:translate-x-1">
                <Cog6ToothIcon className="h-4 w-4" />
                Settings
              </span>
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18, delay: 0.06 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setIsProfileMenuOpen(false)
                onLogout()
              }}
              className="group w-full text-left px-3 py-2 text-sm text-nav-text hover:bg-rust/20 hover:text-rust transition-colors border-t border-rust/10"
            >
              <span className="inline-flex items-center gap-2 transition-transform duration-200 group-hover:translate-x-1">
                <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                Logout
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  useEffect(() => {
    setIsMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (userProfile) {
      const fullName = [userProfile.first_name, userProfile.last_name].filter(Boolean).join(" ")
      setCurrentUser({
        name: fullName || userProfile.email || "Admin User",
        email: userProfile.email || "",
        avatar: userProfile.avatar || "",
      })
      return
    }

    const rawUser = localStorage.getItem("user") || sessionStorage.getItem("user")
    if (!rawUser) return
    try {
      const parsed = JSON.parse(rawUser)
      setCurrentUser({
        name: parsed?.name || parsed?.username || "Admin User",
        email: parsed?.email || "admin@etpsupply.com",
        avatar: parsed?.avatar || "",
      })
    } catch (err) {
      console.error("Failed to parse user profile", err)
    }
  }, [userProfile])

  useEffect(() => {
    setIsProfileMenuOpen(false)
  }, [location.pathname, isMobileOpen])

  useEffect(() => {
    if (!isDesktopExpanded) {
      setOpenMenus({
        Services: false,
        Products: false,
        Support: false,
      })
      setIsProfileMenuOpen(false)
    }
  }, [isDesktopExpanded])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const filteredNavItems = navItems.filter((item) => {
    const term = searchQuery.trim().toLowerCase()
    if (!term) return true
    if (item.label.toLowerCase().includes(term)) return true
    return item.children?.some((child) => child.label.toLowerCase().includes(term))
  })

  const renderNav = () => (
    <nav className="space-y-1">
      {filteredNavItems.map((item) => (
        <div key={item.label}>
          {item.label === "Services" && (
            <div className="my-2 flex items-center gap-2">
              <div className="flex-1 border-t border-rust/20" />
            </div>
          )}
          {item.to ? (
            <>
              <Link
                to={item.to}
                onClick={closeMobileMenu}
                title={!isDesktopExpanded ? item.label : undefined}
                className={`flex items-center ${isDesktopExpanded ? "justify-start gap-3 px-3" : "justify-center px-2"} py-2 rounded-lg transition-all duration-200 ${isActive(item.to)
                    ? "bg-rust/20 text-rust"
                    : "text-nav-text hover:bg-charcoal hover:text-nav-hover"
                  }`}
              >
                <item.icon className="h-5 w-5" />
                <span className={`font-label text-base font-medium transition-all duration-200 origin-left ${isDesktopExpanded ? "opacity-100 max-w-[220px] translate-x-0" : "opacity-0 max-w-0 -translate-x-1 overflow-hidden"}`}>
                  {item.label}
                </span>
              </Link>

              {item.label === "Dashboard" && (
                <div className="my-2">
                  <div className="border-t border-rust/20 mb-2" />
                  <div className="space-y-1">
                    <Link
                      to="/admin/support/request"
                      onClick={closeMobileMenu}
                      title={!isDesktopExpanded ? "Requests" : undefined}
                      className={`flex items-center ${isDesktopExpanded ? "justify-start gap-3 px-3" : "justify-center px-2"} py-2 rounded-lg transition-all duration-200 ${isActive("/admin/support/request")
                          ? "bg-rust/20 text-rust"
                          : "text-nav-text/90 hover:bg-charcoal hover:text-nav-hover"
                        }`}
                    >
                      <DocumentDuplicateIcon className="h-4 w-4" />
                      <span className={`font-label text-base font-medium transition-all duration-200 origin-left ${isDesktopExpanded ? "opacity-100 max-w-[220px] translate-x-0" : "opacity-0 max-w-0 -translate-x-1 overflow-hidden"}`}>
                        Requests
                      </span>
                    </Link>

                    <Link
                      to="/admin/conversation"
                      onClick={closeMobileMenu}
                      title={!isDesktopExpanded ? "Conversations" : undefined}
                      className={`flex items-center ${isDesktopExpanded ? "justify-start gap-3 px-3" : "justify-center px-2"} py-2 rounded-lg transition-all duration-200 ${isActive("/admin/conversation")
                          ? "bg-rust/20 text-rust"
                          : "text-nav-text/90 hover:bg-charcoal hover:text-nav-hover"
                        }`}
                    >
                      <DocumentTextIcon className="h-4 w-4" />
                      <span className={`font-label text-base font-medium transition-all duration-200 origin-left ${isDesktopExpanded ? "opacity-100 max-w-[220px] translate-x-0" : "opacity-0 max-w-0 -translate-x-1 overflow-hidden"}`}>
                        Conversations
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => toggleMenu(item.label)}
                title={!isDesktopExpanded ? item.label : undefined}
                className={`w-full flex items-center ${isDesktopExpanded ? "justify-between gap-3 px-3" : "justify-center px-2"} py-2 rounded-lg transition-all duration-200 text-nav-text hover:bg-charcoal hover:text-nav-hover`}
              >
                <div className={`flex items-center ${isDesktopExpanded ? "gap-3" : ""}`}>
                  <item.icon className="h-5 w-5" />
                  <span className={`font-label text-base font-medium transition-all duration-200 origin-left ${isDesktopExpanded ? "opacity-100 max-w-[220px] translate-x-0" : "opacity-0 max-w-0 -translate-x-1 overflow-hidden"}`}>
                    {item.label}
                  </span>
                </div>
                {isDesktopExpanded && (
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-200 ${openMenus[item.label] ? "rotate-0" : "-rotate-90"
                      }`}
                  />
                )}
              </button>

              <AnimatePresence initial={false}>
                {openMenus[item.label] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="ml-6 pl-2 border-l border-rust/20 space-y-1 mt-1">
                      {item.children.map((child) => (
                        <motion.div
                          key={child.to}
                          initial={{ x: -8, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -8, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                        >
                          <Link
                            to={child.to}
                            onClick={closeMobileMenu}
                            title={!isDesktopExpanded ? child.label : undefined}
                            className={`flex items-center ${isDesktopExpanded ? "justify-start gap-3 px-3" : "justify-center px-2"} py-2 rounded-lg transition-all duration-200 ${isActive(child.to)
                                ? "bg-rust/20 text-rust"
                                : "text-nav-text/80 hover:bg-charcoal hover:text-nav-hover"
                              }`}
                          >
                            <child.icon className="h-4 w-4" />
                            <span className={`font-label text-base font-medium transition-all duration-200 origin-left ${isDesktopExpanded ? "opacity-100 max-w-[220px] translate-x-0" : "opacity-0 max-w-0 -translate-x-1 overflow-hidden"}`}>
                              {child.label}
                            </span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      ))}
    </nav>
  )

  return (
    <>
      {/* Mobile menu trigger */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 inline-flex items-center gap-2 rounded-lg border border-rust/30 bg-charcoal/95 px-3 py-2 text-nav-text"
        aria-label="Open admin menu"
      >
        <Bars3Icon className="h-5 w-5 text-rust" />
        <span className="font-label text-sm uppercase tracking-[2px]">Menu</span>
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <button
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={closeMobileMenu}
          aria-label="Close admin menu overlay"
        />
      )}

      {/* Desktop sidebar */}
      <aside
        onMouseEnter={() => setIsDesktopHovered(true)}
        onMouseLeave={() => setIsDesktopHovered(false)}
        className={`hidden lg:flex ${isDesktopExpanded ? "lg:w-72 xl:w-80 2xl:w-84" : "lg:w-24"} lg:h-screen lg:sticky lg:top-0 lg:self-stretch bg-charcoal/60 border-r border-rust/20 overflow-y-auto overflow-x-hidden transition-all duration-300`}
      >
        <div className="p-4 xl:p-5 w-full h-full flex flex-col overflow-x-hidden">
          <div className="mb-4 text-center">
            {isDesktopExpanded ? (
              <h2 className="font-display text-xl sm:text-2xl text-nav-text leading-tight whitespace-nowrap">
                East Texas <span className="text-rust">Poultry Supply</span>
              </h2>
            ) : (
              <h2 className="font-display text-2xl leading-tight">
                <span className="text-black">ET</span><span className="text-rust">PS</span>
              </h2>
            )}
          </div>
          <div className={`relative mb-4 transition-all duration-200 ${isDesktopExpanded ? "opacity-100 max-h-20 translate-y-0" : "opacity-0 max-h-0 -translate-y-1 pointer-events-none overflow-hidden"}`}>
            <MagnifyingGlassIcon className="h-4 w-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search menu..."
              className="w-full rounded-lg bg-charcoal border border-rust/20 pl-9 pr-3 py-2 text-sm text-nav-text placeholder:text-muted focus:outline-none focus:border-rust"
            />
          </div>
          <div className="flex-1 mt-2">{renderNav()}</div>
          {renderProfileMenu()}
        </div>
      </aside>

      {/* Mobile sidebar drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-screen w-[84vw] max-w-[320px] bg-charcoal border-r border-rust/20 overflow-y-auto transition-transform duration-300 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl sm:text-2xl text-nav-text text-center">
              East Texas <span className="text-rust">Poultry Supply</span>
            </h2>
            <button onClick={closeMobileMenu} aria-label="Close admin menu">
              <XMarkIcon className="h-5 w-5 text-nav-text hover:text-rust transition-colors" />
            </button>
          </div>
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="h-4 w-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search menu..."
              className="w-full rounded-lg bg-charcoal border border-rust/20 pl-9 pr-3 py-2 text-sm text-nav-text placeholder:text-muted focus:outline-none focus:border-rust"
            />
          </div>
          <div className="flex-1 mt-2">{renderNav()}</div>
          {renderProfileMenu()}
        </div>
      </aside>
    </>
  )
}

export default Sidebar