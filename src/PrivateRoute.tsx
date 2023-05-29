import React from 'react';
import { Route, Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ReactNode;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, path }) => {
  const isLoggedIn = sessionStorage.getItem('accessToken') !== null; // Check if the user is logged in

  return isLoggedIn ? (
    <Route path={path} element={element} />
  ) : (
    <Navigate to="/admin/users" replace={true} /> // Redirect to login page if the user is not logged in
  );
};

export default PrivateRoute;
