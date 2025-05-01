import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../../api/apiConfig";

const MainContent = () => {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAction, setSelectedAction] = useState("");
  const [noMessage, setNoMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [updateMessageId, setUpdateMessageId] = useState(null);
  const [newAction, setNewAction] = useState("pending");
  const [updateSuccess, setUpdateSuccess] = useState("");

  const messagesPerPage = 5;

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        setUpdateSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const url = API.CONTACT.MESSAGES(selectedAction || '');

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}` //  Send token in header
        },
        withCredentials: true, //  Include cookie if needed
      });
      const data = Array.isArray(response.data) ? response.data : [];

      if (data.length === 0) {
        setNoMessage(
          `There is no message to show of status = ${selectedAction || "all"}`
        );
      } else {
        setNoMessage("");
      }

      setMessages(data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setNoMessage("Error fetching messages. Please try again.");
      setMessages([]);
    }
  };

  const openUpdateModal = (id) => {
    setUpdateMessageId(id);
    setNewAction("pending");
    setShowModal(true);
  };

  const handleUpdateAction = async () => {
    const token = localStorage.getItem("access_token");
    try {
      await axios.patch(
        API.CONTACT.UPDATE(updateMessageId),
        { action: newAction },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUpdateSuccess("Action updated successfully!");
      setShowModal(false);
      fetchMessages();
    } catch (error) {
      console.error("Error updating action:", error);
      setUpdateSuccess("Failed to update action.");
      setShowModal(false);
    }
  };

  const indexOfLast = currentPage * messagesPerPage;
  const indexOfFirst = indexOfLast - messagesPerPage;
  const currentMessages = Array.isArray(messages)
    ? messages.slice(indexOfFirst, indexOfLast)
    : [];
  const totalPages = Array.isArray(messages)
    ? Math.ceil(messages.length / messagesPerPage)
    : 1;

  return (
    <div className="w-full mt-4 md:mx-4 bg-white p-6 rounded shadow overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Messages</h2>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <select
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-auto"
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
        >
          <option value="">-- Select Action --</option>
          <option value="pending">Pending</option>
          <option value="replied">Replied</option>
          <option value="ignored">Ignored</option>
        </select>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={fetchMessages}
        >
          Apply Filter
        </button>
      </div>

      {/* Success Message */}
      {updateSuccess && (
        <div className="mb-4 text-green-600 font-medium text-center">
          {updateSuccess}
        </div>
      )}

      {/* No Message */}
      {noMessage && (
        <div className="text-center text-red-600 font-medium mb-4">
          {noMessage}
        </div>
      )}

      {/* Messages Table */}
      {currentMessages.length > 0 && (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone Number</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Message</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentMessages.map((msg) => (
              <tr key={msg.id} className="hover:bg-gray-50 transition">
                <td className=" bg-gray-50 px-4 py-3 text-sm">{msg.name}</td>
                <td className="bg-gray-50 px-4 py-3 text-sm text-blue-600">{msg.email}</td>
                <td className="bg-gray-50 px-4 py-3 text-sm">{msg.phone_number}</td>
                <td className="bg-gray-50 px-4 py-3 text-sm">{msg.message}</td>
                <td className="bg-gray-50 px-4 py-3 text-center">
                  <button
                    onClick={() => openUpdateModal(msg.id)}
                    className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {currentMessages.length > 0 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600"
          >
            Prev
          </button>
          <span className="px-4 py-2 text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal for Update */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Update Action
            </h3>
            <select
              value={newAction}
              onChange={(e) => setNewAction(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
            >
              <option value="pending">Pending</option>
              <option value="replied">Replied</option>
              <option value="ignored">Ignored</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAction}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContent;
