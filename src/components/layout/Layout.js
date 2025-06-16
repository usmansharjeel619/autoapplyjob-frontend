import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useApp } from "../../context/AppContext";

const Layout = ({ children, isAdmin = false, showFooter = true }) => {
  const { sidebarOpen, isMobile } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isAdmin={isAdmin} />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          !sidebarOpen && !isMobile ? "lg:ml-20" : ""
        }`}
      >
        {/* Header */}
        <Header isAdmin={isAdmin} />

        {/* Page Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        {/* Footer */}
        {showFooter && <Footer />}
      </div>
    </div>
  );
};

export default Layout;
