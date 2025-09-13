import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { UserProvider } from './context/UserContext';
import { GoogleOAuthProvider } from "@react-oauth/google";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="694336668338-2pf2gqvb569ihlra6kq2jd9kqskp12aj.apps.googleusercontent.com">
    <UserProvider>
    <App />
    </UserProvider>
  </GoogleOAuthProvider>
);