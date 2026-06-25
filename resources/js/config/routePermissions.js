// Single source of truth mapping a route path to the permission key that must
// be present on the logged-in user's role. Keys match the ones already
// managed on the Permission admin screen (VIEW_/ADD_/EDIT_/DELETE_ prefixed) —
// the "view" permission for a page's resource is treated as page access.
// Routes not listed here (e.g. /settings) are open to any authenticated user.
export const ROUTE_PERMISSIONS = {
  '/dashboard': 'VIEW_DASHBOARD',
  '/personal-info': 'VIEW_GENERAL_INFORMATION',
  '/military-service': 'VIEW_MILITARY_SERVICE_HISTORY',
  '/education': 'VIEW_EDUCATION_HISTORY',
  '/training': 'VIEW_SPECIALIZED_TRAINING',
  '/mission': 'VIEW_MISSION_HISTORY',
  '/health': 'VIEW_HEALTH_INFORMATION',
  '/setup/military-rank': 'VIEW_MILITARY_RANK',
  '/setup/position': 'VIEW_POSITION',
  '/setup/unit': 'VIEW_UNIT',
  '/setup/military-unit': 'VIEW_MILITARY_UNIT',
  '/setup/education-level': 'VIEW_EDUCATION_LEVEL',
  '/setup/military-specialty': 'VIEW_MILITARY_SPECIALTY',
  '/role': 'VIEW_ROLE|VIEW_PERMISSION|VIEW_ROLE_PERMISSION',
  '/permission': 'VIEW_PERMISSION',
  '/role-permission': 'VIEW_ROLE_PERMISSION',
  '/users': 'VIEW_USER',
};

export const hasPermission = (user, key) => {
  if (!key) return true;
  if (user?.role?.key?.toLowerCase?.() === 'admin') return true;
  // Support 'KEY_A|KEY_B' OR-logic, mirroring CheckPermission.php on the backend.
  const keys = key.split('|').map((k) => k.trim());
  return keys.some((k) =>
    user?.role?.permissions?.some((p) => p.key === k) ||
    user?.permissions?.some((p) => p.key === k)
  );
};
