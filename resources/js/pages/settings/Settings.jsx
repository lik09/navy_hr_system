import React from 'react';
import { Form, Input, Button, Card, message, Tabs, Select, Divider, Typography, Flex } from 'antd';
import { SaveOutlined, GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import { hasPermission } from '../../config/routePermissions';

const { Title, Text } = Typography;
const NAVY_BLUE = '#002366';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { user, setUser } = useAuthStore();
  const can = (key) => hasPermission(user, key);
  const [profileForm] = Form.useForm();
  const [pwdForm] = Form.useForm();

  React.useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        name: user.name,
        email: user.email,
        username: user.username,
      });
    }
  }, [user]);

  const saveProfile = async () => {
    const values = await profileForm.validateFields();
    try {
      const res = await api.put('/settings/profile', values);
      setUser(res.data);
      message.success(t('success'));
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) Object.values(data.errors).flat().forEach((m) => message.error(m));
      else message.error(t('error'));
    }
  };

  const savePassword = async () => {
    const values = await pwdForm.validateFields();
    try {
      await api.put('/settings/password', values);
      pwdForm.resetFields();
      message.success(t('success'));
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) Object.values(data.errors).flat().forEach((m) => message.error(m));
      else message.error(data?.message || t('error'));
    }
  };

  const tabItems = [
    can('VIEW_PROFILE') && {
      key: 'profile',
      label: t('profile'),
      children: (
        <Form form={profileForm} layout="vertical" style={{ maxWidth: 480 }}>
          <Form.Item name="name" label={t('name')} rules={[{ required: true }]}>
            <Input variant="filled" />
          </Form.Item>
          <Form.Item name="username" label={t('username')} rules={[{ required: true }]}>
            <Input variant="filled" />
          </Form.Item>
          <Form.Item name="email" label={t('email')} rules={[{ required: true, type: 'email' }]}>
            <Input variant="filled" />
          </Form.Item>
          {can('EDIT_PROFILE') && (
            <Button type="primary" icon={<SaveOutlined />} onClick={saveProfile} style={{ background: NAVY_BLUE }}>
              {t('save')}
            </Button>
          )}
        </Form>
      ),
    },
    can('CHANGE_PASSWORD') && {
      key: 'password',
      label: t('change_password'),
      children: (
        <Form form={pwdForm} layout="vertical" style={{ maxWidth: 480 }}>
          <Form.Item name="current_password" label={t('current_password')} rules={[{ required: true }]}>
            <Input.Password variant="filled" />
          </Form.Item>
          <Form.Item name="password" label={t('new_password')} rules={[{ required: true, min: 6 }]}>
            <Input.Password variant="filled" />
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
            <Input.Password variant="filled" />
          </Form.Item>
          <Button type="primary" icon={<SaveOutlined />} onClick={savePassword} style={{ background: NAVY_BLUE }}>
            {t('save')}
          </Button>
        </Form>
      ),
    },
    {
      key: 'language',
      label: t('language'),
      children: (
        <div style={{ maxWidth: 320 }}>
          <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>{t('language')}</Text>
          <Select
            value={i18n.language}
            onChange={(lang) => i18n.changeLanguage(lang)}
            style={{ width: '100%' }}
            size="large"
            options={[
              { value: 'km', label: 'ភាសាខ្មែរ' },
              { value: 'en', label: 'English' },
            ]}
          />
        </div>
      ),
    },
  ].filter(Boolean);

  return (
    <div>
      <Title level={4} style={{ color: NAVY_BLUE, marginBottom: 24 }}>{t('settings')}</Title>
      <Card>
        <Tabs items={tabItems} type="card" />
      </Card>
    </div>
  );
};

export default Settings;
