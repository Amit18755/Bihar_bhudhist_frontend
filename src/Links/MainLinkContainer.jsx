import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../api/apiConfig";

const MainLinkContainer = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLinkId, setSelectedLinkId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  const navigate = useNavigate();

  const { isLoggedIn, role, auth_user_id, username } = useSelector(
    (state) => state.user
  );

  // 👤 Determine if user is a guest
  const isGuest =
    !isLoggedIn ||
    role === "" ||
    auth_user_id === null ||
    username.trim() === "";

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch( API.LINKS.LIST);
        const data = await response.json();
        if (Array.isArray(data)) {
          setLinks(data);
        } else {
          setLinks([]);
        }
      } catch (error) {
        console.error("Error fetching links:", error);
        setLinks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const handleDeleteClick = (id) => {
    if (isGuest) return;
    setSelectedLinkId(id);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    navigate("/add-links");
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(API.LINKS.DELETE(selectedLinkId), {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        setMessage({ text: "Link deleted successfully.", type: "success" });
        setLinks((prevLinks) =>
          prevLinks.filter((link) => link.id !== selectedLinkId)
        );

        setTimeout(() => {
          setMessage({ text: "", type: "" });
          setShowDeleteModal(false);
          navigate("/add-links");
        }, 1000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Failed to delete link.");
      }
    } catch (error) {
      setMessage({
        text: error.message || "An error occurred while deleting.",
        type: "error",
      });

      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 2000);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading links...</div>;
  }

  return (
    <>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <div
            key={link.id}
            className="group relative border-2 border-blue-500 rounded-lg overflow-hidden shadow-md min-h-[260px] flex flex-col justify-start"
          >
            <div className="absolute inset-0 overflow-hidden group">
  <div
    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
    style={{
      backgroundImage: `url(data:image/jpeg;base64,${link.bg_image})`,
    }}
  ></div>
</div>

            <div className="absolute inset-0 bg-white/60"></div>

            <div className="relative z-10 p-4 text-left h-full flex flex-col justify-start">
              <h2 className="text-xl font-bold text-black mb-2">{link.title}</h2>
              <p className="text-black text-sm mb-3">{link.details}</p>
              <a
                href={link.links}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-words mb-4 text-center"
              >
                {link.links}
              </a>

              {/*  Only show buttons to logged-in users */}
              {!isGuest && (
                <div className="flex gap-3 mt-auto">
                  <button
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                       onClick={() => navigate(`/update-link/${link.id}`)}
                      >
                       Update
                  </button>

                  <button
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                    onClick={() => handleDeleteClick(link.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96 relative">
            <h3 className="bg-gray-100 text-xl font-semibold mb-4 text-center text-gray-800">
              Confirm Deletion
            </h3>

            <div className="bg-gray-100 p-4 text-center text-gray-700 mb-4 rounded">
              Are you sure you want to delete this link?
            </div>

            {message.text && (
              <div
                className={`mb-4 text-center font-medium ${
                  message.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MainLinkContainer;
