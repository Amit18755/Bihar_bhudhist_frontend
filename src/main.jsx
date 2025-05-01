import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './redux/store';

// Session handling logic
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
const sessionActive = sessionStorage.getItem('sessionActive') === 'true';

// If user is logged in but no session is active (browser reopened)
if (isLoggedIn && !sessionActive) {
  // Clear localStorage to log the user out
  localStorage.clear();
} else if (isLoggedIn && !sessionActive) {
  // Set sessionActive if the user is already logged in
  sessionStorage.setItem('sessionActive', 'true');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
