import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Import, Trash2 } from "lucide-react"; // icon for delete button
import { useSelector } from "react-redux";
import API from "../api/apiConfig";
 
const GalleryView = () => {
  const [places, setPlaces] = useState([]);
  const [placeImages, setPlaceImages] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showImageDeleteModal, setShowImageDeleteModal] = useState(false);

  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [selectedPlaceHeading, setSelectedPlaceHeading] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  const location = useLocation();
  const navigate = useNavigate();
  
  const { isLoggedIn, role, auth_user_id, username } = useSelector(
    (state) => state.user
  );
  const isGuest =
    !isLoggedIn || role === "" || auth_user_id === null || username.trim() === "";

  const fetchPlaces = async () => {
    try {
      const response = await axios.get(API.GALLERY.LIST);
      if (response.data?.data) {
        setPlaces(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch places:", error);
    }
  };

  const fetchPlaceImages = async (placeId) => {
    try {
      const response = await axios.get(API.GALLERY.GET_IMAGES(placeId));
      const data = response.data;
      setPlaceImages((prev) => ({
        ...prev,
        [placeId]: data.data !== 0 ? data.data : [],
      }));
    } catch (error) {
      console.error(`Error fetching images for place ${placeId}:`, error);
      setPlaceImages((prev) => ({ ...prev, [placeId]: [] }));
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  useEffect(() => {
    places.forEach((place) => fetchPlaceImages(place.id));
  }, [places]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("refresh") === "true") {
      fetchPlaces();
    }
  }, [location]);

  const capitalizeWords = (str) =>
    str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const openDeleteModal = (id) => {
    setSelectedPlaceId(id);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedPlaceId(null);
    setMessage({ text: "", type: "" });
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("access_token");

      await axios.delete(API.GALLERY.DELETE(selectedPlaceId), {
       headers: {
        Authorization: `Bearer ${token}`
      }
     });
      setPlaces((prev) => prev.filter((place) => place.id !== selectedPlaceId));
      setMessage({ text: "Place deleted successfully.", type: "success" });

      setTimeout(() => {
        setShowDeleteModal(false);
        setMessage({ text: "", type: "" });
        setSelectedPlaceId(null);
      }, 3000);
    } catch (error) {
      setMessage({ text: "Failed to delete place. Try again.", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  const openUploadModal = (id, heading) => {
    setSelectedPlaceId(id);
    setSelectedPlaceHeading(capitalizeWords(heading));
    setShowUploadModal(true);
  };

  const handleCancelUpload = () => {
    setShowUploadModal(false);
    setSelectedPlaceId(null);
    setSelectedPlaceHeading("");
    setSelectedFile(null);
    setMessage({ text: "", type: "" });
  };

  const handleImageUpload = async () => {
    if (!selectedFile || !selectedPlaceId) {
      setMessage({ text: "Image or place ID missing.", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return;
    }

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
      });

    try {
      const token = localStorage.getItem("access_token");
      const base64Image = await toBase64(selectedFile);

      const payload = {
       place_id: selectedPlaceId,
       image_upload: base64Image,
      };

      const response = await fetch(API.GALLERY.UPLOAD_IMAGE, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`
        },
       body: JSON.stringify(payload),
     });


      if (response.ok) {
        setMessage({ text: "Image uploaded successfully!", type: "success" });

        setTimeout(() => {
          setShowUploadModal(false);
          setSelectedPlaceId(null);
          setSelectedPlaceHeading("");
          setSelectedFile(null);
          setMessage({ text: "", type: "" });
          navigate("/add-image?refresh=true");
        }, 3000);
      } else {
        const err = await response.json();
        setMessage({
          text: err.message || "Failed to upload image. Try again.",
          type: "error",
        });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage({ text: "Something went wrong.", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  const openImageDeleteModal = (imageId) => {
    setSelectedImageId(imageId);
    setShowImageDeleteModal(true);
  };

  const handleImageDelete = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.delete(API.GALLERY.DELETE_IMAGE(selectedImageId), {
      headers: {
         Authorization: `Bearer ${token}`
       }
     });

      if (response.status === 204 || response.status === 200) {
        setMessage({ text: "Image deleted successfully!", type: "success" });

        setTimeout(() => {
          setShowImageDeleteModal(false);
          setSelectedImageId(null);
          setMessage({ text: "", type: "" });
          navigate("/add-image?refresh=true");
        }, 3000);
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
      setMessage({ text: "Failed to delete image. Try again.", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {places.length === 0 ? (
        <p className="text-gray-600 text-center">No places found.</p>
      ) : (
        places.map((place) => (
          <div
            key={place.id}
            className="bg-white rounded-xl shadow hover:shadow-xl transition-all p-4 space-y-3"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="text-lg font-semibold text-gray-800">
                {capitalizeWords(place.heading)}, {capitalizeWords(place.district)}
              </div>
              {!isGuest && (<button
                onClick={() => openDeleteModal(place.id)}
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
              )}
            </div>

            {placeImages[place.id] ? (
              placeImages[place.id].length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
                  {placeImages[place.id].map((img) => (
                    <div key={img.id} className="relative group overflow-hidden rounded-lg">
                    <img
                      src={`data:image/jpeg;base64,${img.image}`}
                      alt="Place"
                      className="w-full h-45 object-cover rounded-lg shadow-md transform transition-transform duration-300 ease-in-out group-hover:scale-110"
                    />
                    {!isGuest && (
                      <button
                        onClick={() => openImageDeleteModal(img.id)}
                        className="absolute bottom-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-700 transition"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>
                  
                  ))}
                </div>
              ) : (
                <p className="text-red-500 mt-2 text-sm">There is no image to show.</p>
              )
            ) : (
              <p className="text-gray-500">Loading images...</p>
            )}

            <div className="flex justify-end mt-4">
             {!isGuest && (<button
                onClick={() => openUploadModal(place.id, place.heading)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Add Image
              </button>)}
            </div>
          </div>
        ))
      )}

      {/* Delete Place Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-700 text-center mb-4">
              Are you sure you want to delete this place and all associated images?
            </p>
            {message.text && (
              <p
                className={`text-sm text-center font-medium mb-3 ${
                  message.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {message.text}
              </p>
            )}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
              Upload Image for {selectedPlaceHeading}
            </h2>
            {message.text && (
              <div
                className={`mb-4 text-center font-medium ${
                  message.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {message.text}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="w-full mb-4 border border-gray-300 rounded px-3 py-2"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelUpload}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleImageUpload}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Image Modal */}
      {showImageDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
              Delete Image
            </h2>
            <p className="text-sm text-gray-700 text-center mb-4">
              Are you sure you want to delete this image?
            </p>
            {message.text && (
              <p
                className={`text-sm text-center font-medium mb-3 ${
                  message.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {message.text}
              </p>
            )}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowImageDeleteModal(false);
                  navigate(-1); // Go back
                }}
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleImageDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryView;
