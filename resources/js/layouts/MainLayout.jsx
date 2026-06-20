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
} from '@ant-design/icons';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;
const NAVY_BLUE = '#002366';

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, labelKey: 'dashboard' },
  { key: '/personal-info',    icon: <IdcardOutlined />,  labelKey: 'general_info' },
  { key: '/military-service', icon: <BankOutlined />,    labelKey: 'military_service' },
  { key: '/education',        icon: <BookOutlined />,    labelKey: 'education' },
  { key: '/training',         icon: <TrophyOutlined />,  labelKey: 'training' },
  { key: '/mission',          icon: <AimOutlined />,     labelKey: 'mission' },
  { key: '/health',           icon: <HeartOutlined />,   labelKey: 'health' },
];

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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={260}
        style={{ background: NAVY_BLUE, position: 'sticky', top: 0, height: '100vh', overflow: 'auto' }}
        trigger={null}
      >
        <div
          style={{
            padding: collapsed ? '16px 8px' : '16px',
            borderBottom: '1px solid rgba(255,255,255,0.15)',
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/dashboard')}
        >
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto',
          }}>
            <span style={{ fontSize: 24 }}>⚓</span>
          </div>
          {!collapsed && (
            <div style={{ marginTop: 10, color: 'white' }}>
              <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.5 }}> {t('royal_cambodian_navy')} </div>
              <div style={{ marginTop:4 ,fontSize: 14, opacity: 0.75 }}> {t('hr_system')} </div>
            </div>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ background: NAVY_BLUE, borderRight: 0, marginTop: 8 }}
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: t(item.labelKey),
            onClick: () => navigate(item.key),
          }))}
        />

        <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '8px 8px 16px' }}>
          <Button
            block ghost icon={<SettingOutlined />}
            style={{ color: 'rgba(255,255,255,0.75)', borderColor: 'rgba(255,255,255,0.2)', marginBottom: 8 }}
            onClick={() => navigate('/settings')}
          >
            {!collapsed && t('settings')}
          </Button>
          <Button
            block danger icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            {!collapsed && t('logout')}
          </Button>
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
            {/* <Text strong style={{ color: colorText, fontSize: 15 }}>
              Royal Cambodian Navy
            </Text> */}
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
              <Button type="default">
                {currentLang}
              </Button>
            </Dropdown>

            <Button onClick={toggleMode}>
              {mode === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </Button>

            <Flex align="center" gap={8}>
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{ backgroundColor: NAVY_BLUE }}
              />
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
