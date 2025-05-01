import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import API from '../api/apiConfig';

const UpdateUser = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const navigate = useNavigate();
  const { isLoggedIn, role } = useSelector((state) => state.user);

  // Extracted fetch logic
  const fetchUsers = () => {
    const token = localStorage.getItem("access_token");
  
    axios
      .get(API.USER.DETAILS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  };
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    } else if (role !== 'super admin') {
      navigate('/forbidden');
    } else {
      fetchUsers();
    }
  }, [isLoggedIn, role, navigate]);

  const handleBack = () => {
    if (role === 'super admin') {
      navigate('/superUserDashboard');
    }
  };

  const handleUpdateRoleClick = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleUpdate = async () => {
    if (!selectedRole) {
      showMessage('error', 'Please select a role.');
      return;
    }
  
    const token = localStorage.getItem("access_token");
  
    try {
      await axios.post(
        API.USER.UPDATE_ROLE,
        {
          username: selectedUser.username,
          role: selectedRole,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      showMessage('success', 'Role updated successfully!');
      setTimeout(() => {
        setShowModal(false); // close modal
        fetchUsers();        // refresh user list
      }, 1000);
    } catch (error) {
      showMessage('error', 'Failed to update role.');
    }
  };
  

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 1000);
  };

  return (
    <>
      {/* Background content with blur when modal is open */}
      <div className={`${showModal ? 'blur-sm pointer-events-none select-none' : ''}`}>
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-50 shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">All Users</h2>
            <button
              onClick={handleBack}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200"
            >
              Back
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-blue-100 text-gray-800 uppercase text-sm">
                  <th className="py-3 px-4 border-b">Username</th>
                  <th className="py-3 px-4 border-b">First Name</th>
                  <th className="py-3 px-4 border-b">Last Name</th>
                  <th className="py-3 px-4 border-b">Email</th>
                  <th className="py-3 px-4 border-b">Role</th>
                  <th className="py-3 px-4 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className=" bg-gray-100 py-3 px-4 border-b">{user.username}</td>
                      <td className=" bg-gray-100 py-3 px-4 border-b">{user.first_name}</td>
                      <td className="bg-gray-100 py-3 px-4 border-b">{user.last_name || '-'}</td>
                      <td className="bg-gray-100 py-3 px-4 border-b">{user.email}</td>
                      <td className="bg-gray-100 py-3 px-4 border-b capitalize">{user.role}</td>
                      <td className="bg-gray-100 py-3 px-4 border-b text-center">
                        <button
                          onClick={() => handleUpdateRoleClick(user)}
                          className="px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
                        >
                          Update Role
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-5 px-4 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for role update */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96 relative">
            <h3 className=" bg-gray-100 text-xl font-semibold mb-4 text-center text-gray-800">
              Update Role
            </h3>

            <div className=" bg-gray-100 mb-4">
              <label htmlFor="role" className="block mb-2 font-medium text-gray-700">
                Select Role:
              </label>
              <select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">-- Choose Role --</option>
                <option value="super admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="none">None</option>
              </select>
            </div>

            {message.text && (
              <div
                className={`mb-4 text-center font-medium ${
                  message.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateUser;
