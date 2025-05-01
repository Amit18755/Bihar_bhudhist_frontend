import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import API from '../api/apiConfig';

const ModifyImage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const { username, role, isLoggedIn } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    } else if (role === 'none') {
      navigate('/forbidden');
    }
  }, [isLoggedIn, role, navigate]);

  useEffect(() => {
    axios.get( API.OVERVIEW.IMAGES.LIST)
      .then(res => {
        if (res.data.success) {
          setImages(res.data.data);
        }
        setLoading(false);
      })
      .catch(() => {
        setFeedback({ type: 'error', message: 'Failed to load images.' });
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    const token = localStorage.getItem("access_token");

     axios.delete(API.OVERVIEW.IMAGES.DELETE(id), {
      headers: {
         Authorization: `Bearer ${token}`,
      },
        withCredentials: true,
        })
      .then(() => {
        setImages(prev => prev.filter(img => img.id !== id));
        setFeedback({ type: 'success', message: 'Image deleted successfully!' });
        setTimeout(() => setFeedback(null), 2000);
      })
      .catch(() => {
        setFeedback({ type: 'error', message: 'Failed to delete image.' });
        setTimeout(() => setFeedback(null), 2000);
      });
  };

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Modify Overview Images</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-400 hover:bg-gray-500 text-gray-800 px-4 py-2 rounded"
        >
           Back
        </button>
      </div>

      {feedback && (
        <p className={`text-center font-medium ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {feedback.message}
        </p>
      )}

      {loading ? (
        <p className="text-gray-500 text-center">Loading images...</p>
      ) : images.length === 0 ? (
        <p className="text-center text-gray-500">No images available.</p>
      ) : (
        <div className="space-y-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="flex flex-col sm:flex-row items-center gap-4 border border-gray-300 rounded shadow-md bg-white p-4"
            >
              <div className="w-full sm:w-[90%]">
                <img
                  src={`data:image/jpeg;base64,${img.image_base64}`}
                  alt="Overview"
                  className="w-full h-80 object-cover rounded"
                />
              </div>
              <div className="w-full sm:w-[10%] flex justify-center sm:justify-end">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  onClick={() => handleDelete(img.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModifyImage;
