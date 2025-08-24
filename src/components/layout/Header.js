// 2. UPDATED HEADER COMPONENT (src/components/layout/Header.js)
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  X,
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Wrench,
  Zap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import Button from "../ui/Button";

const Header = ({ isAdmin = false }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false); // New mobile menu state
  const { user, logout, getUserDisplayName } = useAuth();
  const { toggleSidebar, notifications, removeNotification, isMobile } =
    useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  // Mobile menu items (same as Sidebar)
  const userMenuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      label: "Profile",
      icon: User,
      path: "/profile",
    },
    {
      label: "AI Tools",
      icon: Wrench,
      path: "/tools",
    },
    {
      label: "Application Status",
      icon: FileText,
      path: "/application-status",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  const adminMenuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      label: "Applicants",
      icon: Users,
      path: "/admin/applicants",
    },
    {
      label: "Applications",
      icon: FileText,
      path: "/admin/applications",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      path: "/admin/analytics",
    },
  ];

  const mobileMenuItems = isAdmin ? adminMenuItems : userMenuItems;

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const handleMobileMenuClick = (path) => {
    setShowMobileMenu(false);
    navigate(path);
  };

  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-2 h-20">
        <div className="flex items-center justify-between h-12">
          {/* Left side */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button - Updated to control mobile menu instead of sidebar */}
            {isMobile ? (
              <Button
                variant="ghost"
                size="sm"
                icon={showMobileMenu ? <X size={20} /> : <Menu size={20} />}
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                icon={<Menu size={20} />}
                onClick={toggleSidebar}
                className="lg:hidden"
              />
            )}

            {/* Logo */}
            <Link
              to={isAdmin ? "/admin/dashboard" : "/dashboard"}
              className="flex items-center gap-2"
            >
              <img
                src="/images/logo.png"
                alt="AutoApplyJob"
                className="h-40 w-auto"
              />
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                icon={<Bell size={20} />}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications.length}
                  </span>
                )}
              </Button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>
                  </div>

                  <div className="py-2">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? "bg-blue-50" : ""
                          }`}
                          onClick={() => removeNotification(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(
                                  notification.timestamp
                                ).toLocaleString()}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-medium text-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {getUserDisplayName()}
                </span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-200">
                    <p className="font-medium text-gray-900">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>

                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={16} />
                      Profile
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings size={16} />
                      Settings
                    </Link>

                    <div className="border-t border-gray-200 my-2" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Click outside to close dropdowns */}
        {(showUserMenu || showNotifications || showMobileMenu) && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setShowUserMenu(false);
              setShowNotifications(false);
              setShowMobileMenu(false);
            }}
          />
        )}
      </header>

      {/* Mobile Menu Dropdown - Only show on mobile */}
      {isMobile && showMobileMenu && (
        <div className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-lg">
          <div className="px-6 py-4">
            {/* Mobile Menu Items */}
            <nav className="space-y-1">
              {mobileMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);

                return (
                  <button
                    key={item.path}
                    onClick={() => handleMobileMenuClick(item.path)}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition-colors
                      ${
                        isActive
                          ? "bg-primary-50 text-primary-700 border border-primary-200"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }
                    `}
                  >
                    <Icon
                      size={20}
                      className={
                        isActive ? "text-primary-700" : "text-gray-500"
                      }
                    />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
