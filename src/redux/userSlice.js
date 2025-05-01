// redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: localStorage.getItem("username") || '',
  auth_user_id: localStorage.getItem("auth_user_id")
    ? parseInt(localStorage.getItem("auth_user_id"))
    : null,
  role: localStorage.getItem("role") || '',
  isLoggedIn: localStorage.getItem("isLoggedIn") === 'true',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      const { username, auth_user_id, role } = action.payload;
      state.username = username;
      state.auth_user_id = auth_user_id;
      state.role = role;
      state.isLoggedIn = true;

      // Persist to localStorage
      localStorage.setItem("username", username);
      localStorage.setItem("auth_user_id", auth_user_id);
      localStorage.setItem("role", role);
      localStorage.setItem("isLoggedIn", "true");

      // Set sessionStorage flag
      sessionStorage.setItem("sessionActive", "true");
    },
    logoutUser(state) {
      state.username = '';
      state.auth_user_id = null;
      state.role = '';
      state.isLoggedIn = false;

      localStorage.clear();
      sessionStorage.clear();
    },
  },
});

// ✅ Make sure these are exported
export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
