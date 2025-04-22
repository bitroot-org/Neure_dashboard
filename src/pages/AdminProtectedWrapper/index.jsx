import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AdminProtectedWrapper = ({ children }) => {
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem('userData'));
  const isEmployee = userData?.roleId === 3;

  if (isEmployee) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedWrapper;