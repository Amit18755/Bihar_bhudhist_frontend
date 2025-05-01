import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/userSlice";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Topbar = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const username = useSelector((state) => state.user.username);
  const role = useSelector((state) => state.user.role); // getting role from redux

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    dispatch(logoutUser());
    navigate("/");
  };

  const greetingMessage =
    role === "super admin"
      ? `Hello !! ${username}`
      : `Hello, ${username}`;

  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 shadow-md rounded md:mt-2 md:mx-4">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          ☰ Menu
        </button>
        <h2 className="text-lg md:text-xl font-semibold">{greetingMessage}</h2>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-full"
      >
        Logout
      </button>
    </div>
  );
};

export default Topbar;
