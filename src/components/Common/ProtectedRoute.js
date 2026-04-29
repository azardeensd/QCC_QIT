import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if we saved user data in localStorage during login
  const savedUser = localStorage.getItem('user');

  // If there is no user data, kick them back to the login page
  if (!savedUser) {
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, let them see the protected page (Dashboard)
  return children;
};

export default ProtectedRoute;