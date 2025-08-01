import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  // Check if user exists in localStorage (session restoration)
  // If user exists but not authenticated, they need to re-enter master password
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists but not authenticated, they need to re-enter master password
  // The Dashboard will handle showing the master password dialog
  return children;
};

export default PrivateRoute; 