import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { hasPermission } from '../../config/routePermissions';

const PermissionRoute = ({ permission, children }) => {
  const { user } = useAuthStore();
  // Fall back to /settings, not /dashboard — /dashboard itself can now be denied
  // (requires VIEW_DASHBOARD), and redirecting a denied user back to /dashboard
  // would loop forever. /settings has no permission requirement.
  if (!hasPermission(user, permission)) return <Navigate to="/settings" replace />;
  return children;
};

export default PermissionRoute;
