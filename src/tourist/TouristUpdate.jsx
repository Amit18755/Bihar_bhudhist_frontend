import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import API from '../api/apiConfig';

const TouristUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isLoggedIn, role } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isLoggedIn || role === "none") {
      navigate("/");
    }
  }, [isLoggedIn, role, navigate]);
  const [formData, setFormData] = useState({
    place_name: '',
    place_address: '',
    place_description: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchPlace = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const res = await fetch(API.TOURISM.GET_BY_ID(id), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setFormData({
          place_name: data.place_name,
          place_address: data.place_address,
          place_description: data.place_description,
          image: null,
        });
        setPreview(`data:image/jpeg;base64,${data.place_image}`);
      } catch (err) {
        console.error('Error fetching place:', err);
      }
    };

    fetchPlace();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
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
            place_name: formData.place_name,
            place_address: formData.place_address,
            place_description: formData.place_description,
          };
      
          if (base64Image) {
            payload.image_upload = base64Image;  
          }
      
          const token = localStorage.getItem("access_token");

        const response = await fetch(API.TOURISM.UPDATE(id), {
             method: 'PUT',
              headers: {
               'Content-Type': 'application/json',
                 Authorization: `Bearer ${token}`,
            },
        body: JSON.stringify(payload),
        });

      
          if (response.ok) {
            setMessage({ type: 'success', text: 'Site updated successfully!' });
            setTimeout(() => {
              setMessage({ type: '', text: '' });
              navigate('/add-tourist');
            }, 3000);
          } else {
            const errorData = await response.json();
            setMessage({ type: 'error', text: errorData.detail || 'Update failed.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
          }
        } catch (err) {
          console.error(err);
          setMessage({ type: 'error', text: 'Something went wrong.' });
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
      };
      
      
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto bg-gray-100 shadow rounded-xl mt-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">
        Update Site
      </h2>

      {message.text && (
        <div
          className={`mb-4 px-4 py-2 rounded text-center font-medium ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1 text-black">Place Name</label>
          <input
            type="text"
            name="place_name"
            value={formData.place_name}
            onChange={handleChange}
            required
            className="bg-white w-full border px-4 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-black">Address</label>
          <input
            type="text"
            name="place_address"
            value={formData.place_address}
            onChange={handleChange}
            required
            className="bg-white w-full border px-4 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-black">Description</label>
          <textarea
            name="place_description"
            value={formData.place_description}
            onChange={handleChange}
            required
            className="bg-white w-full border px-4 py-2 rounded-md h-24 resize-none"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-black">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-500 file:text-white file:rounded-md hover:file:bg-blue-700"
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
            className="bg-gray-500 hover:bg-gray-700 text-white px-5 py-2 rounded-md transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default TouristUpdate;
