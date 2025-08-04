"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import MegaMenu from "./MegaMenu"
import { navIcons } from "./navIcons"

export function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [showProfileCard, setShowProfileCard] = useState(false)
  const profileCardRef = useRef(null)
  const profileButtonRef = useRef(null)
  const { user, logout } = useAuth()
  
  let navItems = []

  if (user) {
    // Example: role 1 = admin, role 2 = beautician, role 3 = customer
    if (user.role === 1) {
      navItems = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Branches", href: "/branches" },
        { name: "Users", href: "/users" },
        { name: "Categories", href: "/categories" },
        { name: "Services", href: "/services" },
        { name: "Bookings", href: "/bookings" },
        {
          name: "Beauticians",
          submenu: [
            { name: "Service Beauticians", href: "/service-beauticians" },
            { name: "Beautician Availability", href: "/beautician-availability" },
          ],
        },
  
         { name: "Appointments", href: "/appointments" },

        { name: "Time Slots", href: "/time-slots" },
        { name: "Invoices", href: "/invoices" },
        { name: "Promotions", href: "/promotions" },
        { name: "Roles", href: "/roles" },
      ]
    } else if (user.role === 2) {
      navItems = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Beautician Availability", href: "/beautician-availability" },
        { name: "Appointments", href: "/appointments" },
      ]
    } else if (user.role === 3) {
      navItems = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Bookings", href: "/bookings" },
      ]
    }
  }

  const [collapsed, setCollapsed] = useState(false)

  // Close profile card when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileCardRef.current && 
        !profileCardRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setShowProfileCard(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await logout();
      setShowProfileCard(false);
      window.location.href = "/login";
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      window.location.href = "/login";
    }
  }

  return (
    <aside className={`bg-white shadow-sm border-r sticky top-0 left-0 h-screen ${collapsed ? 'w-20' : 'w-64'} flex flex-col z-50 transition-all duration-300 relative`}>
      {/* Collapse Button */}
      <button
        className="absolute top-4 right-[-16px] bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md z-10"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        style={{ outline: 'none', border: 'none' }}
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
      
      {/* Logo */}
      <div className={`flex items-center space-x-2 px-6 py-6 border-b ${collapsed ? 'justify-center' : ''}`}> 
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">DS</span>
          </div>
          {!collapsed && <span className="font-bold text-xl text-gray-900">ZenSlot</span>}
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto px-4 py-4 ${collapsed ? 'px-1 py-2' : ''}`}>
        {navItems.map((item) => {
          const Icon = navIcons[item.name] || null;
          return (
            <div key={item.name} className="mb-2">
              {item.submenu ? (
                <div className="group">
                  <button
                    className={`flex items-center w-full px-3 py-2 text-gray-700 hover:text-orange-500 font-medium transition-colors rounded-lg ${collapsed ? 'justify-center' : ''}`}
                    onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                    aria-haspopup="true"
                    aria-expanded={activeDropdown === item.name}
                  >
                    {Icon && <Icon className="mr-2" size={20} />}
                    {!collapsed && item.name}
                    {!collapsed && <ChevronDown className="ml-2" size={16} />}
                  </button>
                  {/* Dropdown */}
                  {activeDropdown === item.name && !collapsed && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((sub) => {
                        const SubIcon = navIcons[sub.name] || null;
                        return (
                          <Link key={sub.name} href={sub.href} className="block px-3 py-1 text-gray-600 hover:text-orange-500 rounded flex items-center">
                            {SubIcon && <SubIcon className="mr-2" size={18} />}
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <Link href={item.href} className={`flex items-center ${collapsed ? 'justify-center' : ''} px-3 py-2 text-gray-700 hover:text-orange-500 font-medium transition-colors rounded-lg`}>
                  {Icon && <Icon className="mr-2" size={20} />}
                  {!collapsed && item.name}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
      
      {/* User Profile Section */}
      {user && (
        <div className="px-4 pb-6 mt-auto relative">
          <button
            ref={profileButtonRef}
            className={`flex items-center w-full ${collapsed ? 'justify-center' : 'space-x-3'} p-2 hover:bg-gray-50 rounded-lg transition-colors`}
            onClick={() => setShowProfileCard(!showProfileCard)}
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600 flex-shrink-0">
              {user.name ? user.name[0].toUpperCase() : <span>U</span>}
            </div>
            {!collapsed && (
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-800 text-sm">{user.name || 'User'}</div>
                <div className="text-xs text-gray-500 truncate">{user.email}</div>
              </div>
            )}
          </button>

          {/* Profile Card */}
          {showProfileCard && (
            <div 
              ref={profileCardRef}
              className={`absolute bottom-full mb-2 ${collapsed ? 'left-16' : 'left-0'} bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64 z-50`}
            >
              <div className="flex items-center space-x-3 mb-3 pb-3 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
                  {user.name ? user.name[0].toUpperCase() : <span>U</span>}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{user.name || 'User'}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="space-y-2">
                <Link href="/profile" onClick={() => setShowProfileCard(false)}>
                  <Button variant="outline" className="w-full bg-white text-gray-700 border-gray-300 justify-start">
                    Profile
                  </Button>
                </Link>
                <Button 
                  className="w-full bg-red-500 hover:bg-red-600 text-white justify-start" 
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Sign Up and Donate Buttons for guests */}
      {!collapsed && !user && (
        <div className="px-4 pb-6 mt-auto flex flex-col space-y-2">
          <Link href="/signup">
            <Button variant="outline" className="w-full bg-white text-gray-700 border-gray-300">
              Sign Up
            </Button>
          </Link>
          <Link href="/donate">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Donate Now</Button>
          </Link>
        </div>
      )}
    </aside>
  )
}