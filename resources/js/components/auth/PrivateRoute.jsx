import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';

const PrivateRoute = ({ children }) => {
  const { token, setUser } = useAuthStore();

  // Cached `user` (incl. role.permissions) is a snapshot from login time. Refresh
  // it on every app-shell mount so permission grants made elsewhere take effect
  // without forcing a logout/login. Render children immediately with the cached
  // value; this just patches the store once the fresh response lands.
  useEffect(() => {
    if (!token) return;
    api.get('/auth/me').then((res) => setUser(res.data)).catch(() => {});
  }, [token, setUser]);
  

  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default PrivateRoute;
