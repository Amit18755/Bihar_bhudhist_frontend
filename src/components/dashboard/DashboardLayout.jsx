import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MainContent from "./MainContent";

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen md:flex bg-white">
      {/* Mobile Topbar always on top */}
      <div className="md:hidden">
        <Topbar toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <MainContent />
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex w-full">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Topbar />
          <MainContent />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
