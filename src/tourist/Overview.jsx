import React, { useEffect, useState , useRef} from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import API from '../api/apiConfig';

const Overview = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [updateText, setUpdateText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFeedback, setImageFeedback] = useState(null);
  const [feedback, setFeedback] = useState(null);
 

  const [originalImages, setOriginalImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1); // Start from 1 because we prepend the last image
  const [isTransitioning, setIsTransitioning] = useState(true);
  const sliderRef = useRef(null);
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
    axios.get(  API.OVERVIEW.IMAGES.LIST)
      .then(res => {
        if (res.data.success && res.data.data.length > 0) {
          const imgs = res.data.data;
          // Prepend last image and append first image for looping effect
          setOriginalImages([imgs[imgs.length - 1], ...imgs, imgs[0]]);
        }
      });
  }, []);

  // Auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [originalImages, currentIndex]);

  const nextSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
  };

  const handleTransitionEnd = () => {
    // Jump instantly if we're on the cloned image
    if (currentIndex === originalImages.length - 1) {
      setIsTransitioning(false);
      setCurrentIndex(1); // jump to first real image
    }
    if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(originalImages.length - 2); // jump to last real image
    }
  };
  
  const fetchOverview = () => {
    axios.get( API.OVERVIEW.LIST)
      .then(response => {
        const data = response.data[0];
        setOverview(data);
        setUpdateText(data.details);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load overview.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOverview();
  }, []);
  const token = localStorage.getItem("access_token");
  const handleUpdate = () => {
    axios.put(API.OVERVIEW.UPDATE(overview.id), {
      details: updateText,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
      .then(() => {
        setFeedback({ type: 'success', message: 'Overview updated successfully!' });
        fetchOverview();
        setTimeout(() => {
          setFeedback(null);
          setShowUpdateModal(false);
        }, 1000);
      })
      .catch(() => {
        setFeedback({ type: 'error', message: 'Failed to update overview.' });
        setTimeout(() => setFeedback(null), 1000);
      });
  };

  const handleCancelImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setImageFeedback(null);
    setShowImageModal(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitImage = () => {
    if (!selectedImage) {
      setImageFeedback({ type: 'error', message: 'Please select an image.' });
      return;
    }

    const token = localStorage.getItem("access_token");

    const reader = new FileReader();
    reader.onloadend = () => {
   const base64String = reader.result.split(',')[1];

    axios.post(API.OVERVIEW.IMAGES.CREATE, {
        image_upload: base64String,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
        })
        .then(res => {
          if (res.data.success) {
            setImageFeedback({ type: 'success', message: 'Image uploaded successfully!' });
            setTimeout(() => {
              setImageFeedback(null);
              handleCancelImage();
              axios.get( API.OVERVIEW.IMAGES.LIST)
              .then(res => {
                if (res.data.success && res.data.data.length > 0) {
                  const imgs = res.data.data;
                  setOriginalImages([imgs[imgs.length - 1], ...imgs, imgs[0]]);
                }
              });

          }, 1000);
          } else {
            setImageFeedback({ type: 'error', message: res.data.message });
          }
        })
        .catch(err => {
          const msg = err.response?.data?.message || 'Failed to upload image.';
          setImageFeedback({ type: 'error', message: msg });
        });
    };
    reader.readAsDataURL(selectedImage);
  };

  return (
    <div className="space-y-6 p-0">
      {/* Image Section */}
      <div className="relative w-full h-100 overflow-hidden bg-gray-200 rounded-xl">
      <div
        ref={sliderRef}
        className="flex"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none'
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {originalImages.map((img, index) => (
          <div
            key={index}
            className="min-w-full h-100 flex items-center justify-center bg-black"
          >
            {img?.image_base64 && (
              <img
                src={`data:image/jpeg;base64,${img.image_base64}`}
                alt={`Slide ${index}`}
                className="object-cover w-full h-full"
              />
            )}
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white px-2 py-1 rounded-full"
        onClick={prevSlide}
      >
        &#8592;
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white px-2 py-1 rounded-full"
        onClick={nextSlide}
      >
        &#8594;
      </button>
    </div>




      {/* Buttons */}
      {!isGuest && (<div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded shadow"
          onClick={() => setShowUpdateModal(true)}
        >
          Update Overview
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow"
          onClick={() => setShowImageModal(true)}
        >
          Add Image
        </button>
        <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded shadow"
            onClick={() => navigate('/modify-image')}
            >
            Modify Image
        </button>
      </div>)}

      {/* Overview Details */}
      <div className="bg-white p-4 rounded shadow border border-gray-200">
         
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="text-gray-700">{overview?.details}</p>
        )}
      </div>

      {/* Update Overview Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg relative">
            <h2 className="text-xl font-semibold mb-4 text-center">Update Overview</h2>

            {feedback && (
              <p
                className={`text-center mb-4 font-medium ${
                  feedback.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {feedback.message}
              </p>
            )}

            <textarea
              className="w-full border border-gray-300 p-2 rounded mb-4 h-40 resize-none"
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowUpdateModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4 text-center">Add Image to Overview</h2>
            {imageFeedback && (
              <p
                className={`text-center mb-4 font-medium ${
                  imageFeedback.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {imageFeedback.message}
              </p>
            )}
            <input
              type="file"
              accept="image/*"
              className="w-full mb-4 border border-gray-300 rounded px-3 py-2"
              onChange={handleImageChange}
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-contain mb-4 rounded border"
              />
            )}

            

            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                onClick={handleCancelImage}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={handleSubmitImage}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
