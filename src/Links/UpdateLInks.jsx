import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/apiConfig";

const UpdateLinks = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isLoggedIn, role } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    title: "",
    details: "",
    link: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);

  // Check login status
  useEffect(() => {
    if (!isLoggedIn || role === "none") {
      navigate("/");
    }
  }, [isLoggedIn, role, navigate]);

  // Fetch existing link data
  useEffect(() => {
    const fetchLinkData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await fetch(API.LINKS.GET_BY_ID(id), {
         headers: {
            Authorization: `Bearer ${token}`,
         },
       });

        const data = await res.json();

        if (res.ok && data) {
          setFormData({
            title: data.title || "",
            details: data.details || "",
            link: data.links || "",
            image: null,
          });

          setPreview(`data:image/jpeg;base64,${data.bg_image}`);
        } else {
          throw new Error("Failed to fetch link data.");
        }
      } catch (error) {
        setMessage({ type: "error", text: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchLinkData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let base64Image = null;

      if (formData.image) {
        base64Image = await toBase64(formData.image);
      }

      const payload = {
        title: formData.title,
        details: formData.details,
        links: formData.link,
      };

      if (base64Image) {
        payload.image_upload = base64Image;
      }

      const token = localStorage.getItem("access_token");

      const response = await fetch(API.LINKS.UPDATE(id), {
       method: "PUT",
       headers: {
         "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
         body: JSON.stringify(payload),
      });


      if (response.ok) {
        setMessage({ type: "success", text: "Link updated successfully!" });
        setTimeout(() => {
          setMessage({ type: "", text: "" });
          navigate("/add-links");
        }, 3000);
      } else {
        const err = await response.json();
        setMessage({
          type: "error",
          text: err.message || "Failed to update link.",
        });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong." });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleCancel = () => {
    navigate("/add-links");
  };

  if (loading) {
    return (
      <div className="text-center py-6 text-gray-600">Loading link details...</div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto bg-gray-100 shadow rounded-xl mt-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">
        Update Official Link
      </h2>

      {message.text && (
        <div
          className={`mb-4 px-4 py-2 rounded text-center font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1 text-black">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="bg-white w-full border px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-black">Details</label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            required
            className="bg-white w-full border px-4 py-2 rounded-md h-24 resize-none focus:outline-none focus:ring focus:border-blue-500"
          ></textarea>
        </div>

        <div>
          <label className="block font-semibold mb-1 text-black">Link</label>
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            required
            className="bg-white w-full border px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-black">
            Background Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-500 file:text-white file:rounded-md file:cursor-pointer hover:file:bg-blue-700"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-4 w-full h-48 object-cover rounded-md"
            />
          )}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 hover:bg-gray-700 text-white px-5 py-2 rounded-md transition w-full"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition w-full"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateLinks;
