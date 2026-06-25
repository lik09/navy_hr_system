import React from 'react';
import { Tabs } from 'antd';
import { TeamOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RoleList from './RoleList';
import PermissionList from './PermissionList';
import useAuthStore from '../../store/authStore';
import { hasPermission } from '../../config/routePermissions';

function RoleAndPermissionTabs() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const can = (key) => hasPermission(user, key);

  const items = [
    can('VIEW_ROLE|VIEW_ROLE_PERMISSION') && {
      key: 'role',
      label: <span><TeamOutlined /> {t('roles')}</span>,
      children: <RoleList />,
    },
    can('VIEW_PERMISSION') && {
      key: 'permission',
      label: <span><SafetyCertificateOutlined /> {t('permissions')}</span>,
      children: <PermissionList />,
    },
  ].filter(Boolean);

  const requestedKey = location.pathname === '/permission' ? 'permission' : 'role';
  const activeKey = items.some((i) => i.key === requestedKey) ? requestedKey : items[0]?.key;

  const handleChange = (key) => {
    navigate(key === 'permission' ? '/permission' : '/role');
  };

  return (
    <Tabs activeKey={activeKey} onChange={handleChange} type="card" items={items} />
  );
}

export default RoleAndPermissionTabs;
