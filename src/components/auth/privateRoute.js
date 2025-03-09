import React from 'react';
import { Navigate, Route, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';  // Make sure your auth context is correctly imported

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;


    // Redirect them to the login page, but save the current location
    // they were trying to go to when they were redirected.
    // This allows us to send them along to that page after they login,
    // which is a nicer user experience than dropping them off on the home page.