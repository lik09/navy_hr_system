import React, { useState } from 'react';
import {
  Layout, Menu, Button, Flex, Avatar, Dropdown, Modal, Typography, theme as antTheme,
} from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  UserOutlined, LogoutOutlined, SettingOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, DashboardOutlined,
  IdcardOutlined, BankOutlined, BookOutlined,
  TrophyOutlined, AimOutlined, HeartOutlined,
  AppstoreOutlined,
  StarOutlined,
  ApartmentOutlined,
  ClusterOutlined,
  ReadOutlined,
  SafetyCertificateOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import logo from '../assets/logo1.jpg';
import '../../css/MainLayout.css';

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;
const NAVY_BLUE = '#002366';

const menuItems = [
  { key: '/dashboard',        icon: <DashboardOutlined />, labelKey: 'dashboard' },
  { key: '/personal-info',    icon: <IdcardOutlined />,   labelKey: 'general_info' },
  { key: '/military-service', icon: <BankOutlined />,     labelKey: 'military_service' },
  { key: '/education',        icon: <BookOutlined />,     labelKey: 'education' },
  { key: '/training',         icon: <TrophyOutlined />,   labelKey: 'training' },
  { key: '/mission',          icon: <AimOutlined />,      labelKey: 'mission' },
  { key: '/health',           icon: <HeartOutlined />,    labelKey: 'health' },
  {
    key: '/setup',
    icon: <AppstoreOutlined />,
    labelKey: 'setup',
    children: [
      { key: '/setup/military-rank',      icon: <StarOutlined />,                labelKey: 'military_rank' },
      { key: '/setup/position',           icon: <ApartmentOutlined />,           labelKey: 'position' },
      { key: '/setup/unit',               icon: <ClusterOutlined />,             labelKey: 'unit' },
      { key: '/setup/military-unit',      icon: <BankOutlined />,                labelKey: 'military_unit' },
      { key: '/setup/education-level',    icon: <ReadOutlined />,                labelKey: 'education_level' },
      { key: '/setup/military-specialty', icon: <SafetyCertificateOutlined />,   labelKey: 'military_specialty' },
    ],
  },
];

// Derive open keys from current path so sub-menu stays open on refresh
const getDefaultOpenKeys = (pathname) => {
  const parent = menuItems.find(
    (item) => item.children && item.children.some((child) => child.key === pathname)
  );
  return parent ? [parent.key] : [];
};

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const { mode, toggleMode } = useThemeStore();
  const { token: { colorBgContainer, borderRadiusLG, colorText } } = antTheme.useToken();

  const handleLogout = () => {
    Modal.confirm({
      title: t('logout'),
      content: t('confirm_delete'),
      okText: t('yes'),
      cancelText: t('no'),
      okButtonProps: { danger: true, style: { background: '#ff4d4f' } },
      onOk: () => {
        logout();
        navigate('/login');
      },
    });
  };

  const langItems = [
    { key: 'km', label: 'ភាសាខ្មែរ' },
    { key: 'en', label: 'English' },
  ];

  const currentLang = i18n.language === 'km' ? 'ភាសាខ្មែរ' : 'English';

  // Build Ant Design menu items, handling children (sub-menus) correctly
  const buildMenuItems = (items) =>
    items.map((item) => {
      if (item.children) {
        // Parent with sub-menu: NO onClick (it's a toggle, not a route)
        return {
          key: item.key,
          icon: item.icon,
          label: t(item.labelKey),
          children: item.children.map((child) => ({
            key: child.key,
            icon: child.icon,
            label: t(child.labelKey),
            onClick: () => navigate(child.key),
          })),
        };
      }
      // Regular item: navigate on click
      return {
        key: item.key,
        icon: item.icon,
        label: t(item.labelKey),
        onClick: () => navigate(item.key),
      };
    });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={260}
        style={{
          background: NAVY_BLUE,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden'
        }}
        trigger={null}
      >
        {/*Wrapper div ខាងក្នុងទើបប្រើ flex */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',    
        }}>
          
          {/* Logo — fixed top */}
          <div
            style={{
              padding: collapsed ? '16px 8px' : '16px',
              borderBottom: '1px solid rgba(255,255,255,0.15)',
              textAlign: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onClick={() => navigate('/dashboard')}
          >
            <div style={{
              width: 65, height: 65,
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,35,102,0.4)',
              margin: '0 auto',
            }}>
              <img src={logo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="logo.jpg" />
            </div>
            {!collapsed && (
              <div style={{ marginTop: 14, color: 'white' }}>
                <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.5 }}>{t('royal_cambodian_navy')}</div>
                <div style={{ marginTop: 4, fontSize: 14, opacity: 0.75 }}>{t('hr_system')}</div>
              </div>
            )}
          </div>

          {/* Menu — scrollable */}
          <div className="sider-menu-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[location.pathname]}
              defaultOpenKeys={getDefaultOpenKeys(location.pathname)}
              style={{ background: NAVY_BLUE, borderRight: 0, marginTop: 8 }}
              items={buildMenuItems(menuItems)}
            />
          </div>

          {/* Bottom buttons — always pinned */}
          <div style={{ padding: '8px 8px 16px', flexShrink: 0 }}>
            <Button
              block ghost icon={<SettingOutlined />}
              style={{ color: 'rgba(255,255,255,0.75)', borderColor: 'rgba(255,255,255,0.2)', marginBottom: 8 }}
              onClick={() => navigate('/settings')}
            >
              {!collapsed && t('settings')}
            </Button>
            <Button block danger icon={<LogoutOutlined />} onClick={handleLogout}>
              {!collapsed && t('logout')}
            </Button>
          </div>

        </div>
      </Sider>

      <Layout>
        <Header
          style={{
            background: colorBgContainer,
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `2px solid ${NAVY_BLUE}`,
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          <Flex align="center" gap={12}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 18, color: colorText }}
            />
          </Flex>

          <Flex align="center" gap={16}>
            <Dropdown
              menu={{
                items: langItems,
                onClick: ({ key }) => i18n.changeLanguage(key),
                selectedKeys: [i18n.language],
              }}
              trigger={['click']}
            >
              <Button type="default">{currentLang}</Button>
            </Dropdown>

            <Button onClick={toggleMode}>
              {mode === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </Button>

            <Flex align="center" gap={8}>
              <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: NAVY_BLUE }} />
              <Text style={{ color: colorText, fontWeight: 500 }}>{user?.name || user?.username}</Text>
            </Flex>
          </Flex>
        </Header>

        <Content style={{ margin: '16px', overflow: 'auto' }}>
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              minHeight: 'calc(100vh - 128px)',
            }}
          >
            <Outlet />
          </div>
        </Content>

        <Footer style={{ textAlign: 'center', color: '#888', padding: '12px 24px', fontSize: 12 }}>
          {t('royal_cambodian_navy_hr_ms_system')} ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;