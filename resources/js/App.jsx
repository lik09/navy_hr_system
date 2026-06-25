import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme as antTheme } from 'antd';
import MainLayout from './layouts/MainLayout.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import PersonalInfo from './pages/section1/PersonalInfo.jsx';
import MilitaryService from './pages/section2/MilitaryService.jsx';
import Education from './pages/section3/Education.jsx';
import Training from './pages/section4/Training.jsx';
import Mission from './pages/section5/Mission.jsx';
import Health from './pages/section6/Health.jsx';
import Settings from './pages/settings/Settings.jsx';
import PrivateRoute from './components/auth/PrivateRoute.jsx';
import PermissionRoute from './components/auth/PermissionRoute.jsx';
import { ROUTE_PERMISSIONS } from './config/routePermissions.js';
import useThemeStore from './store/themeStore.js';
import MilitaryRank from './pages/setup/MilitaryRank.jsx';
import Position from './pages/setup/Position.jsx';
import Unit from './pages/setup/Unit.jsx';
import MilitaryUnit from './pages/setup/MilitaryUnit.jsx';
import EducationLevel from './pages/setup/EducationLevel.jsx';
import MilitarySpecialty from './pages/setup/MilitarySpecialty.jsx';
import Role from './pages/Role/Role.jsx';
import Permission from './pages/Role/Permission.jsx';
import RolePermission from './pages/Role/RolePermission.jsx';
import User from './pages/user/user.jsx';

const App = () => {
  const mode = useThemeStore((s) => s.mode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  const themeConfig = {
    algorithm: mode === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    token: {
      colorPrimary: '#002366',
      fontFamily: "'Hanuman', 'Khmer', system-ui, sans-serif",
      borderRadius: 4,
    },
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<PermissionRoute permission={ROUTE_PERMISSIONS['/dashboard']}><Dashboard /></PermissionRoute>} />
            <Route path="personal-info"     element={<PermissionRoute permission={ROUTE_PERMISSIONS['/personal-info']}><PersonalInfo /></PermissionRoute>} />
            <Route path="military-service"  element={<PermissionRoute permission={ROUTE_PERMISSIONS['/military-service']}><MilitaryService /></PermissionRoute>} />
            <Route path="education"         element={<PermissionRoute permission={ROUTE_PERMISSIONS['/education']}><Education /></PermissionRoute>} />
            <Route path="training"          element={<PermissionRoute permission={ROUTE_PERMISSIONS['/training']}><Training /></PermissionRoute>} />
            <Route path="mission"           element={<PermissionRoute permission={ROUTE_PERMISSIONS['/mission']}><Mission /></PermissionRoute>} />
            <Route path="health"            element={<PermissionRoute permission={ROUTE_PERMISSIONS['/health']}><Health /></PermissionRoute>} />

            <Route path="/setup/military-rank"   element={<PermissionRoute permission={ROUTE_PERMISSIONS['/setup/military-rank']}><MilitaryRank /></PermissionRoute>} />
            <Route path="/setup/position"   element={<PermissionRoute permission={ROUTE_PERMISSIONS['/setup/position']}><Position /></PermissionRoute>} />
            <Route path="/setup/unit"   element={<PermissionRoute permission={ROUTE_PERMISSIONS['/setup/unit']}><Unit /></PermissionRoute>} />
            <Route path="/setup/military-unit"   element={<PermissionRoute permission={ROUTE_PERMISSIONS['/setup/military-unit']}><MilitaryUnit /></PermissionRoute>} />
            <Route path="/setup/education-level"   element={<PermissionRoute permission={ROUTE_PERMISSIONS['/setup/education-level']}><EducationLevel /></PermissionRoute>} />
            <Route path="/setup/military-specialty"   element={<PermissionRoute permission={ROUTE_PERMISSIONS['/setup/military-specialty']}><MilitarySpecialty /></PermissionRoute>} />

            {/*  */}
            <Route path="/role"   element={<PermissionRoute permission={ROUTE_PERMISSIONS['/role']}><Role /></PermissionRoute>} />
            <Route path="/permission"   element={<PermissionRoute permission={ROUTE_PERMISSIONS['/permission']}><Permission /></PermissionRoute>} />
            <Route path="/role-permission"   element={<PermissionRoute permission={ROUTE_PERMISSIONS['/role-permission']}><RolePermission /></PermissionRoute>} />
            <Route path="/users"   element={<PermissionRoute permission={ROUTE_PERMISSIONS['/users']}><User /></PermissionRoute>} />


            <Route path="settings"  element={<Settings />} />
            <Route path="*"         element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
