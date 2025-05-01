import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/userSlice";
import Cookies from "js-cookie";

const Forbidden = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const handleGoBack = () => {
    // Clear cookies and logout
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    dispatch(logoutUser());

    navigate("/"); // ⬅️ Optional redirect after logout
  };

  useEffect(() => {
    // If unauthenticated, redirect to login/home page
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Forbidden</h1>
      <p className="text-lg mb-6">You don’t have permission to access this page.</p>
      <button
        onClick={handleGoBack}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go Back to Home Page
      </button>
    </div>
  );
};

export default Forbidden;
