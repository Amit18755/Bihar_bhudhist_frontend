import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { Link, useNavigate } from "react-router-dom";
import API from '../api/apiConfig';

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clearMessage = () => {
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(
         API.USER.LOGIN,
        {
          username: username.trim().toUpperCase(), 
          password,
        },
        { withCredentials: true }
      );

      const data = response.data;

      //  Using consistent dispatch format:
      dispatch(setUser({
        username: data.username,
        auth_user_id: data.id,  // make sure your API sends 'id'
        role: data.role
      }));

      localStorage.setItem("access_token", data.access_token);

      //  Redirect based on role
      if (data.role === "super admin") {
        navigate("/superUserDashboard");
      } else if (data.role === "admin") {
        navigate("/adminDashboard");
      } else {
        navigate("/");
      }

    } catch (error) {
      setErrorMessage(error.response?.data?.detail || "Login failed!");
      clearMessage();
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <h2 className="text-xl font-semibold mb-4">Sign Up</h2>

      {/* Error Message Box */}
      {errorMessage && (
        <div className="mb-4 px-4 py-2 rounded bg-red-100 text-red-700 border border-red-400">
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 w-full max-w-sm"
      >
        <input
          type="text"
          placeholder="Username"
          className="border p-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-400"
        >
          Sign Up
        </button>
        <div className="text-center">
          <Link
            to="/forgetpassword"
            className="text-sm text-blue-600 hover:underline"
          >
            Forget Password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
