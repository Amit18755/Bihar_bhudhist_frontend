import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {

  const navigate = useNavigate();

  const { isLoggedIn, role} = useSelector(
  (state) => state.user
  );
  const isSuperAdmin =
  isLoggedIn &&
  role === 'super admin';

  return (
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } md:block w-full md:w-[20%] h-full md:h-[95vh] bg-gray-100 p-4 rounded-lg shadow-md md:ml-[2%]`}
    >
      <button
        className="block md:hidden mb-4 text-red-500 font-semibold"
        onClick={toggleSidebar}
      >
        Close Menu ✖
      </button>
      <ul className="space-y-5">
        {isSuperAdmin &&(<li><Link to="/create-user" className="hover:text-blue-600 text-lg">Add User</Link></li>)}
        {isSuperAdmin && (<li><Link to="/update-user" className="hover:text-blue-600 text-lg">Update User</Link></li> )}
        <li><Link to="/update-profile" className="hover:text-blue-600 text-lg">Update Profile</Link></li>
        <li><Link to="/add-tourist" className="hover:text-blue-600 text-lg">Add Pilgrim Place</Link></li>
        <li><Link to="/add-image" className="hover:text-blue-600 text-lg">Add Image</Link></li>
        <li><Link to="/add-links" className="hover:text-blue-600 text-lg">Add Links</Link></li>
         
        <li><Link to="/change-password" className="hover:text-blue-600 text-lg">Change Password</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
