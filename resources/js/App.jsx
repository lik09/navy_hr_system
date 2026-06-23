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
import useThemeStore from './store/themeStore.js';
import MilitaryRank from './pages/setup/MilitaryRank.jsx';
import Position from './pages/setup/Position.jsx';
import Unit from './pages/setup/Unit.jsx';
import MilitaryUnit from './pages/setup/MilitaryUnit.jsx';
import EducationLevel from './pages/setup/EducationLevel.jsx';
import MilitarySpecialty from './pages/setup/MilitarySpecialty.jsx';

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
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="personal-info"     element={<PersonalInfo />} />
            <Route path="military-service"  element={<MilitaryService />} />
            <Route path="education"         element={<Education />} />
            <Route path="training"          element={<Training />} />
            <Route path="mission"           element={<Mission />} />
            <Route path="health"            element={<Health />} />
            
            <Route path="/setup/military-rank"   element={<MilitaryRank />} />
            <Route path="/setup/position"   element={<Position />} />
            <Route path="/setup/unit"   element={<Unit />} />
            <Route path="/setup/military-unit"   element={<MilitaryUnit />} />
            <Route path="/setup/education-level"   element={<EducationLevel />} />
            <Route path="/setup/military-specialty"   element={<MilitarySpecialty />} />

            <Route path="settings"  element={<Settings />} />
            <Route path="*"         element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
