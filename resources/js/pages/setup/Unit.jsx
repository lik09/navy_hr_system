import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, Button, Modal, Form, Input, Switch, Space,
  Typography, Tag, Tooltip, message, Popconfirm, Row, Col,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  ClusterOutlined, SearchOutlined, ReloadOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import WaveLoading from '../../components/ui/WaveLoading';
import useAuthStore from '../../store/authStore';
import { hasPermission } from '../../config/routePermissions';

const { Title, Text } = Typography;
const NAVY = '#002366';

function Unit() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { user } = useAuthStore();
  const can = (key) => hasPermission(user, key);

  const [state, setState] = useState({ list: [], loading: false });
  const [open, setOpen]             = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [btnLoading, setBtnLoading]   = useState(false);
  const [search, setSearch]           = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // ─── Fetch ───────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setState(s => ({ ...s, loading: true }));
    try {
      const { data } = await api.get('unit');
      setState({ list: data, loading: false });
    } catch {
      message.error(t('error'));
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ─── Open modal ──────────────────────────────────────────
  const openCreate = () => {
    setEditingItem(null);
    form.resetFields();
    form.setFieldsValue({ status: true });
    setOpen(true);
  };

  const openEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      name:    record.name,
      name_kh: record.name_kh,
      status:  record.status === 1 || record.status === true,
    });
    setOpen(true);
  };

  // ─── Submit ──────────────────────────────────────────────
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setBtnLoading(true);
      const payload = { ...values, status: values.status ? 1 : 0 };

      if (editingItem) {
        await api.put(`unit/${editingItem.id}`, payload);
        message.success(t('updated_succes'));
      } else {
        await api.post('unit', payload);
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
      await api.delete(`unit/${id}`);
      message.success(t('deleted_succes'));
      fetchData();
    } catch {
      message.error(t('failed_to_deete'));
    }
  };

  // ─── Filter ──────────────────────────────────────────────
  const filtered = (state.list || []).filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.name_kh?.includes(search)
  );

  // ─── Columns ─────────────────────────────────────────────
  const columns = [
    {
      title: t('tb_no'),
      width: 60,
      align: 'center',
      render: (_, __, i) => (
        <Text type="secondary">
          {(currentPage - 1) * PAGE_SIZE + i + 1}
        </Text>
      ),
    },
    {
      title: t('lb_name'),
      dataIndex: 'name',
      render: (v) => <Text strong>{v}</Text>,
    },
    {
      title: t('lb_name_kh'),
      dataIndex: 'name_kh',
      render: (v) => <Text>{v || '—'}</Text>,
    },
    {
      title: t('status'),
      dataIndex: 'status',
      align: 'center',
      width: 100,
      render: (v) =>
        v ? <Tag color="success">{t('active')}</Tag>
          : <Tag color="default">{t('inactive')}</Tag>,
    },
    {
      title: t('action'),
      align: 'center',
      width: 160,
      render: (_, record) => (
        <Space>
          {can('EDIT_UNIT') && (
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
          {can('DELETE_UNIT') && (
            <Popconfirm
              title={t('confirm_delete')}
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

  // ─── Loading ─────────────────────────────────────────────
  if (state.loading && state.list.length === 0) {
    return <WaveLoading minHeight={600} />;
  }

  // ─── Render ──────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space align="center">
            <ClusterOutlined style={{ fontSize: 22, color: NAVY }} />
            <Title level={4} style={{ margin: 0, color: NAVY }}>
              {t('unit')}
            </Title>
          </Space>
        </Col>
        <Col>
          {can('ADD_UNIT') && (
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
            <Button icon={<ReloadOutlined />} onClick={fetchData} />
          </Tooltip>
        </Space>
      </Row>

      {/* Table */}
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

      {/* Modal */}
      <Modal
        centered
        title={
          <Space>
            <ClusterOutlined style={{ color: NAVY }} />
            <span>
              {editingItem
                ? `${t('edit')} ${t('unit')}`
                : `${t('add')} ${t('unit')}`}
            </span>
          </Space>
        }
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
            name="name"
            label={t('lb_name')}
            rules={[{ required: true, message: t('please_enter_name_en') }]}
          >
            <Input placeholder={t('please_enter_name_en')} />
          </Form.Item>

          <Form.Item name="name_kh" label={t('lb_name_kh')}>
            <Input placeholder={t('please_enter_name_kh')} />
          </Form.Item>

          <Form.Item name="status" label={t('status')} valuePropName="checked">
            <Switch
              checkedChildren={t('active')}
              unCheckedChildren={t('inactive')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Unit;