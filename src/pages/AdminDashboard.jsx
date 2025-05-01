import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import Footer from "../components/Footer";

function AdminDashboard() {
  const { isLoggedIn, role } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    
    
    if (!isLoggedIn) {
       
      
       navigate("/");
      
    } else if (role !== "admin") {
       navigate("/forbidden");
    }
  }, [isLoggedIn, role, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <DashboardLayout />
      </div>
      <Footer />
    </div>
  )
}

export default AdminDashboard;

 
 

