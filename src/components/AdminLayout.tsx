import { Link, useLocation } from "@tanstack/react-router"
import { type ReactNode, useState } from "react"
import {
  Menu,
  X,
  LayoutDashboard,
  MapPin,
  User,
  LogOut,
  Package,
  Layers,
  TriangleAlert,
} from "lucide-react"
import { useStockAlerts } from "../hooks/useStockAlerts"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const { data: alerts = [] } = useStockAlerts()

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    )
  }

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Branches", path: "/branches", icon: MapPin },
    { name: "Products", path: "/products", icon: Package },
    { name: "Stock", path: "/stock", icon: Layers },
  ]

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-700">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center px-6 border-b border-gray-800">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center mr-3">
              <span className="font-bold text-white">SM</span>
            </div>
            <span className="text-lg font-bold tracking-wide">
              Stock Manager
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-3 rounded-md transition-colors ${
                    active
                      ? "bg-orange-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon
                    className={`w-5 h-5 mr-3 ${active ? "text-white" : "text-gray-400"}`}
                  />
                  <span className="font-medium">{item.name}</span>
                  {item.name === "Stock" && alerts.length > 0 && (
                    <TriangleAlert className="w-4 h-4 text-white ml-auto" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-800">
            <button className="flex items-center w-full px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors">
              <LogOut className="w-5 h-5 mr-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shadow-sm z-10">
          <div className="flex items-center">
            <button
              className="p-2 -ml-2 mr-2 md:hidden text-gray-600 hover:bg-gray-100 rounded-md"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <h2 className="text-xl font-semibold text-gray-800 md:hidden">
              Stock Manager
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
              <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center border border-orange-200">
                <User className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium hidden sm:block">
                Admin User
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-5xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
