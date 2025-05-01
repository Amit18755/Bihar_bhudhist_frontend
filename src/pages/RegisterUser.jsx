import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from '../api/apiConfig';

const RegisterUser = () => {
  const { isLoggedIn, role } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    repassword: "",
    role: "none",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  // Super admin protection
  useEffect(() => { 
      if (!isLoggedIn) {
          navigate("/"); 
      } else if (role !== "super admin") {
         navigate("/forbidden");
      }
    }, [isLoggedIn, role, navigate]);

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData({ ...formData, [name]: value.trimStart() });
  };
  

  const clearForm = () => {
    setFormData({
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      repassword: "",
      role: "none",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Final cleanup of formData
    const cleanedData = {
      username: formData.username.trim(),
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      repassword: formData.repassword,
      role: formData.role,
    };
  
    if (cleanedData.password !== cleanedData.repassword) {
      setError(true);
      setMessage("Passwords do not match!");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
  
    if (!validatePassword(cleanedData.password)) {
      setError(true);
      setMessage(
        "Password must be at least 6 characters, contain one capital letter, one number, and one special character."
      );
      setTimeout(() => setMessage(""), 2000);
      return;
    }
  
    try {
        const token = localStorage.getItem("access_token");
        await axios.post(API.USER.CREATE, {
        username: cleanedData.username,
        first_name: cleanedData.first_name,
        last_name: cleanedData.last_name,
        email: cleanedData.email,
        password: cleanedData.password,
        role: cleanedData.role,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
      setError(false);
      setMessage("User registered successfully!");
      setTimeout(() => {
        setMessage("");
        clearForm();
        navigate("/superUserDashboard");
      }, 3000);
    } catch (err) {
        const apiErrors = err.response?.data;
        setError(true);
    
        // Specific field error messages
        if (apiErrors?.email?.length) {
          setMessage("Email already exists.");
        } else if (apiErrors?.username?.length) {
          setMessage("Username already exists.");
        } else if (typeof apiErrors === "string") {
          setMessage(apiErrors);
        } else {
          setMessage("User registration failed!");
        }
    
        setTimeout(() => setMessage(""), 4000);
      }
  };
   
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Register New User
        </h2>

        {message && (
          <div
            className={`mb-4 p-3 text-center rounded-lg text-sm font-semibold ${
              error ? "bg-red-100 text-red-700 border border-red-400" : "bg-green-100 text-green-700 border border-green-400"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={formData.last_name}
            onChange={handleChange}
          
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="repassword"
            placeholder="Re-enter Password"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={formData.repassword}
            onChange={handleChange}
            required
          />
          <p className="text-sm text-gray-500 mt-1">
          Minimum 6 characters, at least 1 uppercase letter, 1 number, and 1 special character.
         </p>
           <select
            name="role"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={formData.role}
            onChange={handleChange}
            required
        >
            <option value="" disabled hidden>
                 Select the Role
            </option>
            <option value="super admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="none">None</option>
        </select>



          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => navigate("/superUserDashboard")}
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

export default RegisterUser;
