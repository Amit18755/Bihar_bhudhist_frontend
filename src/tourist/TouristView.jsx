import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import Overview from './Overview';
import API from '../api/apiConfig';

const TouristView = () => {
  const [places, setPlaces] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

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
    const fetchPlaces = async () => {
      try {
        const response = await fetch( API.TOURISM.LIST);
        const data = await response.json();
        setPlaces(data);
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    };

    fetchPlaces();
  }, []);

  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  const handleDeleteClick = (place) => {
    setSelectedPlace(place);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedPlace(null);
    setMessage({ type: '', text: '' });
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(API.TOURISM.DELETE(selectedPlace.id), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Place deleted successfully.',
        });
        setPlaces((prev) =>
          prev.filter((place) => place.id !== selectedPlace.id)
        );
      } else {
        setMessage({
          type: 'error',
          text: 'Failed to delete the place.',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Something went wrong.',
      });
    } finally {
      setTimeout(() => {
        setMessage({ type: '', text: '' });
        setShowDeleteModal(false);
        navigate('/add-tourist?refresh=true');
      }, 1000);
    }
  };

  return (
    <div className="mx-4 px-4 py-6">
       
      <Overview/>
      <div className="space-y-10">
        {places.map((place, index) => {
          const imageUrl = `data:image/jpeg;base64,${place.place_image}`;
          const capitalName = capitalizeWords(place.place_name);
          const capitalAddress = capitalizeWords(place.place_address);
          const isEven = index % 2 === 1;

          return (
            <div
              key={place.id}
              className={`flex flex-col md:flex-row items-center justify-between bg-gray-100 shadow rounded-lg p-4 ${
                isEven ? 'md:flex-row-reverse' : ''
              }`}
            >
              <img
                src={imageUrl}
                alt={capitalName}
                className="w-full md:w-2/5 h-72 object-cover rounded-lg"
              />
              <div className="w-full md:w-3/5 px-0 md:px-6 mt-4 md:mt-0">
                <h3 className="text-xl md:text-2xl font-semibold mb-2 text-red-800">
                  {capitalName}, {capitalAddress}
                </h3>
                <p className="text-gray-700 mb-4">{place.place_description}</p>
                {!isGuest && (<div className="flex gap-4">
                  <button
                    onClick={() => handleDeleteClick(place)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => navigate(`/update-tourist/${place.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                    Update
                  </button>
                </div>)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Place Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
              Confirm Deletion
            </h2>
            <p className="text-m text-gray-700 text-center mb-4">
              Are you sure to delete{' '}
              <span className="font-semibold  text-red-500">
                {capitalizeWords(selectedPlace?.place_name)}, {capitalizeWords(selectedPlace?.place_address)}
              </span>{' '}
              and associated image?
            </p>

            {message.text && (
              <div
                className={`text-center mb-4 px-4 py-2 rounded ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {message.text}
              </div>
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
    </div>
  );
};

export default TouristView;
