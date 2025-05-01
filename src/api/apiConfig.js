const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API = {
  USER: {
    LOGIN: `${BASE_URL}/api/user/login/`,
    CREATE: `${BASE_URL}/api/user/create/`,
    FORGET_PASSWORD: `${BASE_URL}/api/user/forget-password/`,
    CHANGE_PASSWORD: `${BASE_URL}/api/user/change-password/`,
    UPDATE_ROLE: `${BASE_URL}/api/user/update-role/`,
    GET_BY_USERNAME: (username) => `${BASE_URL}/api/user/get/${username}/`,
    UPDATE: `${BASE_URL}/api/user/update/`,
    DETAILS: `${BASE_URL}/api/user/details/`,
    OTP: `${BASE_URL}/api/user/otp/`,
  },
  CONTACT: {
    CREATE: `${BASE_URL}/user/contact/`,
    MESSAGES: (action = '') => `${BASE_URL}/user/contact/messages/${action}`,
    UPDATE: (id) => `${BASE_URL}/user/contact/messages/update/${id}/`,
  },
  GALLERY: {
    CREATE: `${BASE_URL}/gallery/places/create/`,
    LIST: `${BASE_URL}/gallery/places/list/`,
    DELETE: (id) => `${BASE_URL}/gallery/places/delete/${id}/`,
    UPLOAD_IMAGE: `${BASE_URL}/gallery/places/image/upload/`,
    GET_IMAGES: (placeId) => `${BASE_URL}/gallery/places/${placeId}/images/`,
    DELETE_IMAGE: (imageId) => `${BASE_URL}/gallery/places/image/delete/${imageId}/`,
  },
  TOURISM: {
    CREATE: `${BASE_URL}/tourist/places/create/`,
    LIST: `${BASE_URL}/tourist/places/`,
    GET_BY_ID: (id) => `${BASE_URL}/tourist/places/${id}/`,
    UPDATE: (id) => `${BASE_URL}/tourist/places/${id}/update/`,
    DELETE: (id) => `${BASE_URL}/tourist/places/${id}/delete/`,
  },
  OVERVIEW: {
    LIST: `${BASE_URL}/overview/list/`,
    CREATE: `${BASE_URL}/overview/create/`,
    UPDATE: (id) => `${BASE_URL}/overview/update/${id}/`,
    IMAGES: {
      LIST: `${BASE_URL}/overview/images/list/`,
      CREATE: `${BASE_URL}/overview/images/create/`,
      UPDATE: (id) => `${BASE_URL}/overview/images/update/${id}/`,
      DELETE: (id) => `${BASE_URL}/overview/images/delete/${id}/`,
    },
  },
  LINKS: {
    CREATE: `${BASE_URL}/link/create/`,
    LIST: `${BASE_URL}/link/list/`,
    DELETE: (id) => `${BASE_URL}/link/delete/${id}/`,
    UPDATE: (id) => `${BASE_URL}/link/update/${id}/`,
    GET_BY_ID: (id) => `${BASE_URL}/link/get/${id}/`,
  }
};

export default API;
