import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const TouristHeading = () => {
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

  const handleAddSite = () => {
    navigate("/add-touristSites");
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mx-4 px-4 py-6 bg-gray-100 rounded-lg shadow ">
      <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
        Buddhist Pilgrimage Sites
      </h1>
      <div className="flex gap-3">
        <button
          onClick={handleAddSite}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          Add Sites
        </button>
        <button
          onClick={handleBack}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default TouristHeading;
