import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Settings,
  FileText,
  Bell,
  Users,
  BarChart3,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
  Wrench,
  Zap,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const Sidebar = ({ isAdmin = false }) => {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen, toggleSidebar, isMobile } = useApp();
  const { isAdmin: userIsAdmin } = useAuth();

  // Modified user menu - removed job browsing and application features
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

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          bg-white border-r border-gray-200
          transform transition-all duration-300 ease-in-out
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
          ${sidebarOpen ? "w-64" : "lg:w-20"}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <img
                src="images/logo.png"
                alt="AutoApplyJob"
                className="w-40 h-40"
              />
            </div>
          )}

          {!sidebarOpen && !isMobile && (
            <div className="flex items-center justify-center w-full">
              <img
                src="images/logo.png"
                alt="AutoApplyJob"
                className="w-40 h-40"
              />
            </div>
          )}

          {/* Toggle button for desktop */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-1 hover:bg-gray-100"
              icon={
                sidebarOpen ? (
                  <ChevronLeft size={18} />
                ) : (
                  <ChevronRight size={18} />
                )
              }
            />
          )}

          {/* Close button for mobile */}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              icon={<X size={20} />}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>

        {/* Prominent AI Automation Status */}
        {!isAdmin && (
          <div className="p-4 border-b border-gray-200">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <Zap className="w-6 h-6 text-green-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                {(sidebarOpen || isMobile) && (
                  <div>
                    <h3 className="font-semibold text-green-800 text-sm">
                      AI System Active
                    </h3>
                    <p className="text-xs text-green-700">
                      Automated job applications running
                    </p>
                  </div>
                )}
              </div>

              {(sidebarOpen || isMobile) && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-700">Status:</span>
                    <span className="text-xs font-medium text-green-800">
                      Running
                    </span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-1.5">
                    <div
                      className="bg-green-500 h-1.5 rounded-full animate-pulse"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    AI is scanning and applying to relevant jobs for you
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group relative
                  ${
                    isActive
                      ? "bg-primary-50 text-primary-700 border border-primary-200"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                  ${!sidebarOpen && !isMobile ? "justify-center" : ""}
                `}
                title={!sidebarOpen && !isMobile ? item.label : ""}
              >
                <Icon
                  size={20}
                  className={isActive ? "text-primary-700" : "text-gray-500"}
                />
                {(sidebarOpen || isMobile) && (
                  <span className="font-medium">{item.label}</span>
                )}

                {/* Tooltip for collapsed state */}
                {!sidebarOpen && !isMobile && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer - Removed Quick Links */}
        <div className="p-4 border-t border-gray-200">
          {(sidebarOpen || isMobile) && (
            <div className="bg-primary-50 rounded-lg p-4">
              <h4 className="font-semibold text-primary-900 mb-2">
                {isAdmin ? "Admin Panel" : "AutoApplyJob"}
              </h4>
              <p className="text-sm text-primary-700">
                {isAdmin
                  ? "Manage automated job applications and user accounts"
                  : "AI-powered job application automation"}
              </p>
            </div>
          )}

          {!sidebarOpen && !isMobile && (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center relative group">
                <span className="text-primary-600 font-bold text-xs">
                  {isAdmin ? "A" : "AI"}
                </span>

                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {isAdmin ? "Admin Panel" : "AutoApplyJob"}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
