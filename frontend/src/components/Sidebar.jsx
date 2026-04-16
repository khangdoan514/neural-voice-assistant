import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { 
  HomeIcon, 
  WrenchIcon, 
  CubeIcon, 
  PhotoIcon, 
  LifebuoyIcon,
  ChevronDownIcon,
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
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline"

const Sidebar = ({ onLogout }) => {
  const location = useLocation()
  const [openMenus, setOpenMenus] = useState({
    Services: true,
    Products: true,
    Support: true,
  })
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }))
  }

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: HomeIcon },
    { to: "/admin/home", label: "Home Page", icon: PhotoIcon },
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

  const isActive = (path) => {
    return location.pathname === path
  }

  const isChildActive = (children) => {
    return children?.some(child => location.pathname === child.to)
  }

  const closeMobileMenu = () => setIsMobileOpen(false)

  useEffect(() => {
    setIsMobileOpen(false)
  }, [location.pathname])

  const renderNav = () => (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <div key={item.label}>
          {item.to ? (
            <Link
              to={item.to}
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive(item.to)
                  ? "bg-rust/20 text-rust"
                  : "text-nav-text hover:bg-charcoal hover:text-nav-hover"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-label text-base font-medium">{item.label}</span>
            </Link>
          ) : (
            <>
              <button
                onClick={() => toggleMenu(item.label)}
                className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-nav-text hover:bg-charcoal hover:text-nav-hover"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span className="font-label text-base font-medium">{item.label}</span>
                </div>
                {openMenus[item.label] ? (
                  <ChevronDownIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )}
              </button>
              
              {openMenus[item.label] && (
                <div className="ml-6 pl-2 border-l border-rust/20 space-y-1 mt-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.to}
                      to={child.to}
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                        isActive(child.to)
                          ? "bg-rust/20 text-rust"
                          : "text-nav-text/80 hover:bg-charcoal hover:text-nav-hover"
                      }`}
                    >
                      <child.icon className="h-4 w-4" />
                      <span className="font-label text-sm">{child.label}</span>
                    </Link>
                  ))}
                </div>
              )}
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
      <aside className="hidden lg:flex lg:w-72 xl:w-80 2xl:w-84 lg:h-screen lg:sticky lg:top-0 lg:self-stretch bg-charcoal/60 border-r border-rust/20 overflow-y-auto">
        <div className="p-4 xl:p-5 w-full h-full flex flex-col">
          <h2 className="font-display text-xl sm:text-2xl text-nav-text text-center mb-4 pb-2 border-b border-rust/30">
            East Texas <span className="text-rust">Poultry Supply</span>
          </h2>
          <div className="flex-1">{renderNav()}</div>
          <button
            onClick={onLogout}
            className="mt-4 px-4 py-2 bg-rust text-white rounded-lg hover:bg-rust-dark transition-colors text-base w-full"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-screen w-[84vw] max-w-[320px] bg-charcoal border-r border-rust/20 overflow-y-auto transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-rust/30">
            <h2 className="font-display text-xl sm:text-2xl text-nav-text text-center">
              East Texas <span className="text-rust">Poultry Supply</span>
            </h2>
            <button onClick={closeMobileMenu} aria-label="Close admin menu">
              <XMarkIcon className="h-5 w-5 text-nav-text hover:text-rust transition-colors" />
            </button>
          </div>
          <div className="flex-1">{renderNav()}</div>
          <button
            onClick={onLogout}
            className="mt-4 px-4 py-2 bg-rust text-white rounded-lg hover:bg-rust-dark transition-colors text-base w-full"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar