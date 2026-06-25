import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Flex, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import logo from '../../assets/logo1.jpg';

const { Title, Text } = Typography;
const NAVY_BLUE = '#002366';

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { token, setAuth } = useAuthStore();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (token) navigate('/personal-info', { replace: true });
  }, [token, navigate]);

  useEffect(() => {
    api.get('/roles/public')
      .then((res) => setRoles(res.data || []))
      .catch(() => message.error('Failed to load roles.'));
  }, []);

  const toSelectOptions = (list) =>
    (list || []).map((item) => ({ value: item.id, label: item.name }));

  const onFinish = async (values) => {
    try {
      const res = await api.post('/auth/register', values);
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
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #001845 0%, #002d6b 50%, #003f99 100%)',
        padding: '24px',
      }}
    >
      <Card
        style={{ width: 480, boxShadow: '0 12px 40px rgba(0,0,0,0.3)', borderRadius: 12 }}
        bodyStyle={{ padding: '40px 40px 32px' }}
      >
        <Flex vertical align="center" style={{ marginBottom: 28 }}>
          <div
            style={{
              width: 120, height: 120,
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,35,102,0.4)', 
              borderRadius: '50%',
              background: NAVY_BLUE,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <img src={logo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="logo.jpg" />
          </div>
          <Title level={4} style={{ margin: 0, color: NAVY_BLUE }}>Royal Cambodian Navy</Title>
          <Text type="secondary">{t('register')}</Text>
        </Flex>

        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item name="name" label={t('name')} rules={[{ required: true }]}>
            <Input prefix={<UserOutlined style={{ color: NAVY_BLUE }} />} />
          </Form.Item>
          <Form.Item name="username" label={t('username')} rules={[{ required: true }]}>
            <Input prefix={<UserOutlined style={{ color: NAVY_BLUE }} />} />
          </Form.Item>
          <Form.Item name="email" label={t('email')} rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<MailOutlined style={{ color: NAVY_BLUE }} />} />
          </Form.Item>
          <Form.Item name="role_id" label={t('lb_role')} rules={[{ required: true }]}>
            <Select options={toSelectOptions(roles)} />
          </Form.Item>
          <Form.Item name="password" label={t('password')} rules={[{ required: true, min: 6 }]}>
            <Input.Password prefix={<LockOutlined style={{ color: NAVY_BLUE }} />} />
          </Form.Item>
          <Form.Item
            name="password_confirmation"
            label={t('confirm_password')}
            dependencies={['password']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve();
                  return Promise.reject('Passwords do not match!');
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: NAVY_BLUE }} />} />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ background: NAVY_BLUE, borderColor: NAVY_BLUE, height: 44 }}
          >
            {t('register')}
          </Button>
        </Form>

        <Flex justify="center" style={{ marginTop: 20 }}>
          <Text type="secondary">{t('have_account')}&nbsp;</Text>
          <Link to="/login" style={{ color: NAVY_BLUE, fontWeight: 600 }}>
            {t('login_here')}
          </Link>
        </Flex>
      </Card>
    </div>
  );
};

export default Register;
