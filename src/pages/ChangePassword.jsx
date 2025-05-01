import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from '../api/apiConfig';

const ChangePassword = () => {
  const { username, role, isLoggedIn } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState({ type: "", content: "" });
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else if (role === "none") {
      navigate("/forbidden");
    }
  }, [isLoggedIn, role, navigate]);
  useEffect(() => {
    if (message.content) {
      const timer = setTimeout(() => {
        setMessage({ type: "", content: "" });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!validatePassword(newPassword)) {
      setMessage({
        type: "error",
        content:
          "Password must be at least 6 characters, include 1 capital letter, 1 number, and 1 special character.",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage({ type: "error", content: "New passwords do not match." });
      return;
    }

    try {
      const response = await axios.post(
         API.USER.LOGIN,
        {
          username: username.trim().toUpperCase(),
          password: currentPassword,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const data =response.data;
        localStorage.setItem("access_token", data.access_token);

        const token = localStorage.getItem("access_token");

        await axios.put(API.USER.CHANGE_PASSWORD, {
          username: username.trim().toUpperCase(),
          new_password: newPassword,
        },
        {
         headers: {
          Authorization: `Bearer ${token}`,
          },
        });

        setMessage({ type: "success", content: "Password updated successfully!" });

        setTimeout(() => {
          if (role === "super admin") navigate("/superUserDashboard");
          else if (role === "admin") navigate("/adminDashboard");
          else navigate("/");
        }, 1500);
      }
    } catch (error) {
      setMessage({
        type: "error",
        content:
          "Current password is incorrect or an error occurred. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    if (role === "super admin") navigate("/superUserDashboard");
    else if (role === "admin") navigate("/adminDashboard");
    else navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Change Password
        </h2>

        {message.content && (
          <div
            className={`mb-4 text-sm text-center font-medium ${
              message.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message.content}
          </div>
        )}

        <label className="block mb-2 text-sm font-medium">Current Password</label>
        <input
          type="password"
          className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />

        <label className="block mb-2 text-sm font-medium">New Password</label>
        <input
          type="password"
          className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <label className="block mb-2 text-sm font-medium">
          Re-enter New Password
        </label>
        <input
          type="password"
          className="w-full mb-6 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
        />
        <p className="text-xs text-gray-600 mb-6">
          Password must be at least 6 characters long and include at least one uppercase letter, one number, and one special character (e.g., !, @, #, $).
        </p>

        <div className="flex justify-between gap-4">
          <button
            type="submit"
            className="w-1/2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Change Password
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-1/2 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;

