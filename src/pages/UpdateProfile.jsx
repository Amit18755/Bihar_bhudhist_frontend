import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from '../api/apiConfig';

const UpdateProfile = () => {
  const { isLoggedIn, role, username } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else if (role === "none") {
      navigate("/forbidden");
    } else {
      fetchUserData();
    }
  }, [isLoggedIn, role, username, navigate]);

 const fetchUserData = async () => {
    const token = localStorage.getItem("access_token");
  
    try {
      const res = await axios.get(API.USER.GET_BY_USERNAME(username), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setFormData(res.data);
    } catch (err) {
      setError(true);
      setMessage("Failed to fetch user data");
      setTimeout(() => setMessage(""), 1000);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      username: formData.username,
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim(),
    };

    try {
      const token = localStorage.getItem("access_token");
      await axios.put(API.USER.UPDATE, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setError(false);
      setMessage("User details updated successfully!");
      setTimeout(() => {
        setMessage("");
        navigate(-1); 
      }, 1000);
    } catch (err) {
      const apiError = err.response?.data;
      setError(true);
      if (apiError?.email) {
        setMessage("Email already exists.");
      } else if (apiError?.error) {
        setMessage(apiError.error);
      } else {
        setMessage("Update failed.");
      }
      setTimeout(() => setMessage(""), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Update Profile
        </h2>

        {message && (
          <div
            className={`mb-4 p-3 text-center rounded-lg text-sm font-semibold ${
              error
                ? "bg-red-100 text-red-700 border border-red-400"
                : "bg-green-100 text-green-700 border border-green-400"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              disabled
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">First Name</label>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Last Name</label>
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email ID</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Role</label>
            <select
              name="role"
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
              value={formData.role}
              disabled
            >
              <option value="super admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="none">None</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
