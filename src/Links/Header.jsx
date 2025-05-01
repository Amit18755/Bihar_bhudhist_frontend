import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import { toast } from "react-toastify"; // Optional, for messages

const Header = () => {
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.user);

  const handleBack = () => {
    if (role === "super admin") {
      navigate("/superUserDashboard");
    } else if (role === "admin") {
      navigate("/adminDashboard");
    } else {
      toast.info("Redirecting to Home Page");
      setTimeout(() => navigate("/"), 3000);
    }
  };
  const handleAddNew = () => {
    navigate("/addNewLinks");
  };

  return (
    <div className="bg-gray-100 rounded-xl shadow-md p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h1 className="text-3xl font-bold text-gray-800"> Official Links</h1>
      <div className="flex flex-wrap gap-2">
      <button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
           Add New Link
        </button>
        <button
          onClick={handleBack}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Header;
