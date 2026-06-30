import React from 'react';
import { Form, Input, Button, Card, message, Tabs, Select, Typography, Flex, Avatar, Upload } from 'antd';
import { SaveOutlined, GlobalOutlined, UserOutlined, CameraOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import api, { apiFormData } from '../../api/axios';
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
  const [imageFile, setImageFile]   = React.useState(null);
  const [previewUrl, setPreviewUrl] = React.useState(user?.image_url || null);
  const [hovering, setHovering]     = React.useState(false);
  const [removeImage, setRemoveImage] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        name: user.name,
        email: user.email,
        username: user.username,
      });
      setPreviewUrl(user.image_url || null);
      setRemoveImage(false);
    }
  }, [user]);

  const saveProfile = async () => {
    const values = await profileForm.validateFields();
    try {
      const fd = new FormData();
      if (values.name)     fd.append('name',     values.name);
      if (values.username) fd.append('username', values.username);
      if (values.email)    fd.append('email',    values.email);
      if (imageFile)       fd.append('image',    imageFile);
      if (removeImage)     fd.append('remove_image', '1');

      const res = await apiFormData('/settings/profile', 'POST', fd);
      setUser(res.data);
      setImageFile(null);
      setRemoveImage(false);
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
        <Flex style={{width: '100%'}}>
          <Form form={profileForm} layout="vertical" style={{ maxWidth: 480 ,width: '100%'}}>
            <div
              style={{ position: 'relative', width: 100, margin: '10px auto 16px' }}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              <Upload
                name="image"
                accept="image/png,image/jpeg,image/webp"
                showUploadList={false}
                customRequest={() => {}}
                beforeUpload={(file) => {
                  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
                  if (!allowed.includes(file.type)) {
                    message.error('Only JPG / PNG / WEBP images are allowed');
                    return Upload.LIST_IGNORE;
                  }
                  if (file.size / 1024 / 1024 > 2) {
                    message.error('Image must be smaller than 2 MB');
                    return Upload.LIST_IGNORE;
                  }
                  setImageFile(file);
                  setPreviewUrl(URL.createObjectURL(file));
                  setRemoveImage(false);
                  return false;
                }}
              >
                <div style={{ cursor: 'pointer', position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    size={100}
                    src={previewUrl || undefined}
                    icon={!previewUrl && <UserOutlined />}
                    style={{ backgroundColor: NAVY_BLUE }}
                  />
                  {!(previewUrl && hovering) && (
                    <div style={{
                      position: 'absolute', bottom: 0, right: 0,
                      background: NAVY_BLUE, borderRadius: '50%',
                      width: 28, height: 28, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <CameraOutlined style={{ color: '#fff', fontSize: 14 }} />
                    </div>
                  )}
                </div>
              </Upload>

              {previewUrl && hovering && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewUrl(null);
                    setImageFile(null);
                    setRemoveImage(true);
                  }}
                  style={{
                    position: 'absolute', top: 0, left: 0,
                    width: 100, height: 100,
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.45)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', zIndex: 10,
                  }}
                >
                  <DeleteOutlined style={{ color: '#ff4d4f', fontSize: 24 }} />
                </div>
              )}
            </div>

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
        </Flex>
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
