import { ClusterOutlined, DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Modal, Popconfirm, Row, Select, Space, Table, Tag, Typography, Tooltip } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NAVY } from '../../components/section1/personalInfoStyles';
import api from '../../api/axios';
import WaveLoading from '../../components/ui/WaveLoading';
import useAuthStore from '../../store/authStore';
import { hasPermission } from '../../config/routePermissions';

const { Text ,Title } = Typography;

function User() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { user } = useAuthStore();
  const can = (key) => hasPermission(user, key);

  const [state, setState] = useState({ list: [], loading: false });
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // ==== Fetch ====
  const fetchData = useCallback(async () => {
    setState(s => ({ ...s, loading: true }));
    try {
      const res = await api.get('users', { params: { per_page: 1000 } });
      setState({ list: res.data?.data?.data || [], loading: false });
    } catch {
      message.error('Failed to load data.');
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await api.get('roles', { params: { per_page: 1000 } });
      setRoles(res.data?.data?.data || []);
    } catch {
      message.error('Failed to load roles.');
    }
  }, []);

  useEffect(() => {
    fetchData();
    if (can('ADD_USER') || can('EDIT_USER')) fetchRoles();
  }, [fetchData, fetchRoles]);

  // ─── Open modal ──────────────────────────────────────────
  const openCreate = () => {
    setEditingItem(null);
    form.resetFields();
    setOpen(true);
  };

  const openEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      username: record.username,
      name: record.name,
      email: record.email,
      password: '',
      role_id: record.role_id,
    });
    setOpen(true);
  };

  // ─── Submit ──────────────────────────────────────────────
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setBtnLoading(true);
      const payload = { ...values };
      if (!payload.password) delete payload.password;

      if (editingItem) {
        await api.put(`users/${editingItem.id}`, payload);
        message.success(t('updated_succes'));
      } else {
        await api.post('users', payload);
        message.success(t('created_succes'));
      }

      setOpen(false);
      fetchData();
    } catch (err) {
      if (err?.response?.data?.errors) {
        const errors = err.response.data.errors;
        Object.keys(errors).forEach(field => {
          message.error(`${field}: ${errors[field][0]}`);
        });
      }
    } finally {
      setBtnLoading(false);
    }
  };

  // ─── Delete ──────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await api.delete(`users/${id}`);
      message.success(t('deleted_succes'));
      fetchData();
    } catch {
      message.error(t('failed_to_deete'));
    }
  };

  // ─── Filter ──────────────────────────────────────────────
  const filtered = state.list.filter(item =>
    item.username?.toLowerCase().includes(search.toLowerCase()) ||
    item.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.email?.toLowerCase().includes(search.toLowerCase())
  );

  // ─── Columns ─────────────────────────────────────────────
  const columns = [
    {
      title: t('tb_no'),
      width: 60,
      align: 'center',
      render: (_, __, i) => (
        <Text type="secondary">{(currentPage - 1) * PAGE_SIZE + i + 1}</Text>
      ),
    },
    {
      title: t('username'),
      dataIndex: 'username',
      render: (v) => <Text strong>{v}</Text>,
    },
    {
      title: t('lb_name'),
      dataIndex: 'name',
    },
    {
      title: t('email'),
      dataIndex: 'email',
    },
    {
      title: t('lb_role'),
      dataIndex: 'role',
      align: 'center',
      render: (role) => role ? <Tag color="blue">{role.name}</Tag> : <Text type="secondary">—</Text>,
    },
    {
      title: t('action'),
      align: 'center',
      width: 160,
      render: (_, record) => (
        <Space>
          {can('EDIT_USER') && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              style={{ background: NAVY, fontSize: 11 }}
              onClick={() => openEdit(record)}
            >
              {t('edit')}
            </Button>
          )}

          {can('DELETE_USER') && (
            <Popconfirm
              title={t('confirm_delete_user')}
              okText={t('yes')}
              cancelText={t('cancel')}
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(record.id)}
            >
              <Button danger icon={<DeleteOutlined />} size="small" style={{ fontSize: 11 }}>
                {t('delete')}
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  if (state.loading && state.list.length === 0) {
    return <WaveLoading minHeight={600} />;
  }

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space align="center">
            <UserOutlined style={{ fontSize: 22, color: NAVY }} />
            <Title level={4} style={{ margin: 0, color: NAVY }}>
              {t('users')}
            </Title>
          </Space>
        </Col>
        <Col>
          {can('ADD_USER') && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: NAVY }}
              onClick={openCreate}
            >
              {t('add_new')}
            </Button>
          )}
        </Col>
      </Row>

      <Row>
        <Space style={{ marginBottom: 20 }}>
          <Input
              placeholder={`${t('search')}...`}
              prefix={<SearchOutlined />}
              value={search}
              onChange={e => setSearch(e.target.value)}
              allowClear
              style={{ width: 220 }}
            />
            <Tooltip title={t('refresh')}>
              <Button icon={<ReloadOutlined />} onClick={() => { fetchData(); if (can('ADD_USER') || can('EDIT_USER')) fetchRoles(); }} />
            </Tooltip>
        </Space>
      </Row>

      <Table
        rowKey="id"
        dataSource={filtered}
        columns={columns}
        loading={state.loading}
        pagination={{
          pageSize: PAGE_SIZE,
          current: currentPage,
          onChange: (page) => setCurrentPage(page),
          showTotal: (total) => `${t('total')} : ${total} ${t('record')}`,
        }}
        bordered
        size="middle"
      />

      <Modal
        centered
        title={editingItem ? `${t('edit')} ${t('users')}` : `${t('add')} ${t('users')}`}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        okText={editingItem ? t('edit') : t('add')}
        cancelText={t('cancel')}
        confirmLoading={btnLoading}
        okButtonProps={{ style: { background: NAVY } }}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="username"
            label={t('username')}
            rules={[{ required: true, message: t('please_enter_username') }]}
          >
            <Input placeholder={t('please_enter_username')} />
          </Form.Item>

          <Form.Item
            name="name"
            label={t('lb_name')}
            rules={[{ required: true, message: t('please_enter_name_en') }]}
          >
            <Input placeholder={t('please_enter_name_en')} />
          </Form.Item>

          <Form.Item
            name="email"
            label={t('email')}
            rules={[{ required: true, type: 'email', message: t('please_enter_email') }]}
          >
            <Input placeholder={t('please_enter_email')} />
          </Form.Item>

          <Form.Item
            name="password"
            label={t('password')}
            extra={editingItem ? t('leave_blank_to_keep_password') : undefined}
            rules={[
              editingItem
                ? { min: 6, message: t('please_enter_password') }
                : { required: true, min: 6, message: t('please_enter_password') },
            ]}
          >
            <Input.Password placeholder={t('please_enter_password')} />
          </Form.Item>

          <Form.Item name="role_id" label={t('lb_role')}>
            <Select
              allowClear
              options={roles.map(r => ({ value: r.id, label: r.name }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default User;
