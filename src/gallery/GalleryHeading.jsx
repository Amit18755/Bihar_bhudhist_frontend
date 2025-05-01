import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import API from "../api/apiConfig";

const GalleryHeading = () => {
  const { role, isLoggedIn } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [placeName, setPlaceName] = useState("");
  const [district, setDistrict] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (!isLoggedIn) navigate("/");
    else if (role === "none") navigate("/forbidden");
  }, [isLoggedIn, role, navigate]);

  const handleBack = () => {
    if (role === "super admin") navigate("/superUserDashboard");
    else if (role === "admin") navigate("/adminDashboard");
    else {
      toast.info("Redirecting to Home Page");
      setTimeout(() => navigate("/"), 3000);
    }
  };

  const handleAdd = async () => {
    if (!placeName || !district) {
      setMessage({ text: "Both fields are required", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return;
    }

    const capitalizedHeading = placeName.toUpperCase();
    const capitalizedDistrict = district.toUpperCase();

    try { 
       const token = localStorage.getItem("access_token");

       await axios.post( API.GALLERY.CREATE, {
        heading: capitalizedHeading,
        district: capitalizedDistrict,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage({ text: "Place added successfully!", type: "success" });

      setTimeout(() => {
        setPlaceName("");
        setDistrict("");
        setMessage({ text: "", type: "" });
        setShowAddModal(false);
        navigate("/add-image?refresh=true");
      }, 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Failed to add place. Try again.";
      setMessage({ text: errorMsg, type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 px-4 py-3 bg-white rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight mb-2 sm:mb-0">
          Gallery
        </h2>

        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium px-5 py-2 rounded-xl shadow hover:scale-105 hover:brightness-110 transition-all duration-200 ease-in-out"
          >
            Add New Place
          </button>
          <button
            onClick={handleBack}
            className="bg-gradient-to-r from-gray-500 to-gray-700 text-white font-medium px-5 py-2 rounded-xl shadow hover:scale-105 hover:brightness-110 transition-all duration-200 ease-in-out"
          >
            Back
          </button>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96 relative">
            <h3 className="bg-gray-100 text-xl font-semibold text-center text-gray-800 rounded py-2 mb-2">
              Add New Place
            </h3>

            {message.text && (
              <div
                className={`text-center font-medium mb-4 ${
                  message.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">Place Name</label>
              <input
                type="text"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Back
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryHeading;
