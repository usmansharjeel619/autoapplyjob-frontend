import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Settings,
  Wrench,
  Users,
  FileText,
  BarChart3,
  X,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const Sidebar = ({ isAdmin = false }) => {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen, isMobile } = useApp();
  const { isAdmin: userIsAdmin } = useAuth();

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
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
          ${!sidebarOpen && !isMobile ? "lg:w-20" : ""}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AA</span>
              </div>
              <span className="font-bold text-xl text-gray-900">
                {isAdmin ? "Admin" : "AutoApply"}
              </span>
            </div>
          )}

          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              icon={<X size={20} />}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>

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
                  flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
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
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          {(sidebarOpen || isMobile) && (
            <div className="bg-primary-50 rounded-lg p-4">
              <h4 className="font-semibold text-primary-900 mb-2">
                {isAdmin ? "Admin Panel" : "Upgrade Plan"}
              </h4>
              <p className="text-sm text-primary-700 mb-3">
                {isAdmin
                  ? "Manage the entire platform"
                  : "Get more features with Pro"}
              </p>
              {!isAdmin && (
                <Button size="sm" className="w-full">
                  Upgrade Now
                </Button>
              )}
            </div>
          )}

          {!sidebarOpen && !isMobile && (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <span className="text-primary-600 font-bold text-xs">
                  {isAdmin ? "A" : "P"}
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
