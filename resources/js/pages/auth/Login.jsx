import React, { useEffect } from 'react';
import { Form, Input, Button, Card, message, Typography, Flex } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';

const { Title, Text } = Typography;
const NAVY_BLUE = '#002366';

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { token, setAuth } = useAuthStore();

  useEffect(() => {
    if (token) navigate('/personal-info', { replace: true });
  }, [token, navigate]);

  const onFinish = async (values) => {
    try {
      const res = await api.post('/auth/login', values);
      setAuth(res.data.token, res.data.user);
      message.success(t('success'));
      navigate('/personal-info');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        Object.values(data.errors).flat().forEach((m) => message.error(m));
      } else {
        message.error(data?.message || t('error'));
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #001845 0%, #002d6b 50%, #003f99 100%)',
      }}
    >
      <Card
        style={{
          width: 420,
          boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
          borderRadius: 12,
          overflow: 'hidden',
        }}
        bodyStyle={{ padding: '40px 40px 32px' }}
      >
        <Flex vertical align="center" style={{ marginBottom: 32 }}>
          <div
            style={{
              width: 80, height: 80, borderRadius: '50%',
              background: NAVY_BLUE,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
              boxShadow: '0 4px 16px rgba(0,35,102,0.4)',
            }}
          >
            <span style={{ fontSize: 36 }}>⚓</span>
          </div>
          <Title level={4} style={{ margin: 0, color: NAVY_BLUE }}>Royal Cambodian Navy</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>Personnel Management System</Text>
        </Flex>

        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            name="username"
            label={t('username')}
            rules={[{ required: true, message: `${t('username')} is required` }]}
          >
            <Input prefix={<UserOutlined style={{ color: NAVY_BLUE }} />} />
          </Form.Item>
          <Form.Item
            name="password"
            label={t('password')}
            rules={[{ required: true, message: `${t('password')} is required` }]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: NAVY_BLUE }} />} />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ background: NAVY_BLUE, borderColor: NAVY_BLUE, height: 44, marginTop: 8 }}
          >
            {t('login')}
          </Button>
        </Form>

        <Flex justify="center" style={{ marginTop: 20 }}>
          <Text type="secondary">{t('no_account')}&nbsp;</Text>
          <Link to="/register" style={{ color: NAVY_BLUE, fontWeight: 600 }}>
            {t('register_here')}
          </Link>
        </Flex>
      </Card>
    </div>
  );
};

export default Login;
