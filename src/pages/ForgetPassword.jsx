import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/userSlice";
import API from "../api/apiConfig";

const ForgetPassword = () => {
  const [username, setUsername] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const isValidPassword = (password) => {
    const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|:;"'<>,.?/~`]).{6,}$/;
    return pattern.test(password);
  };

  const handleGetOtp = async () => {
    try {
      const res = await axios.post(API.USER.OTP, {
        username: username.toUpperCase(),
      });

      if (res.status === 200) {
        showMessage("OTP sent to registered email", "success");
        setOtpSent(true);
      }
    } catch (err) {
      const errorText = err.response?.data?.detail || "Failed to send OTP";
      showMessage(errorText, "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const cleanUsername = username.toUpperCase();
  
    if (password !== rePassword) {
      showMessage("Passwords do not match", "error");
      return;
    }
  
    if (!isValidPassword(password)) {
      showMessage(
        "Password must be at least 6 characters, include 1 capital letter, 1 number, and 1 special character.",
        "error"
      );
      return;
    }
  
    try {
      // step1: Reset password
      await axios.post(API.USER.FORGET_PASSWORD, {
        username: cleanUsername,
        otp,
        new_password: password,
      });
  
      showMessage("Password changed successfully", "success");
  
      // Step 2: Auto-login after short delay
      setTimeout(async () => {
        try {
          const loginRes = await axios.post(
            API.USER.LOGIN,
            { username: cleanUsername, password },
            { withCredentials: true }
          );
  
          const { username: apiUsername, auth_user_id, role, access_token } = loginRes.data;
  
          dispatch(setUser({ username: apiUsername, auth_user_id, role }));
          localStorage.setItem("access_token", access_token);
  
          if (role === "super admin") {
            navigate("/superUserDashboard");
          } else if (role === "admin") {
            navigate("/adminDashboard");
          } else {
            showMessage("Redirecting to Home Page", "info");
            setTimeout(() => navigate("/"), 1500);
          }
        } catch (loginError) {
          const loginErrorText = loginError.response?.data?.detail || "Auto login failed";
          console.error("Auto login failed:", loginErrorText);
          showMessage(loginErrorText, "error");
        }
      }, 3000);  
    } catch (err) {
      const errorText = err.response?.data?.detail || "Failed to reset password";
      console.error("Password reset error:", errorText);
      showMessage(errorText, "error");
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-black px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-6 md:p-8 rounded shadow-md w-full max-w-sm sm:max-w-md lg:max-w-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Forget Password
        </h2>

        {message.text && (
          <div
            className={`mb-4 text-center p-2 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex flex-col space-y-[15px]">
          <div>
            <label className="block mb-1 font-medium">Username:</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.trimStart().replace(/\s+$/, ""))
              }
              className="w-full border p-2 rounded bg-gray-100"
              required
            />
          </div>

          {!otpSent ? (
            <button
              type="button"
              onClick={handleGetOtp}
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-500"
            >
              Get OTP
            </button>
          ) : (
            <>
              <div>
                <label className="block mb-1 font-medium">Enter OTP:</label>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter the OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border p-2 rounded bg-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">New Password:</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border p-2 rounded bg-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Re-enter Password:
                </label>
                <input
                  type="password"
                  name="rePassword"
                  placeholder="Re-enter password"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  className="w-full border p-2 rounded bg-gray-100"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-500 mt-4"
              >
                Reset Password
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => navigate("/signin")}
            className="text-blue-600 hover:underline text-sm text-center mt-2"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgetPassword;
