import { KeyOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Divider, Flex, Input, message, Modal, Row, Space, Table, Tag, Tooltip, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NAVY } from '../../components/section1/personalInfoStyles';
import api from '../../api/axios';
import WaveLoading from '../../components/ui/WaveLoading';
import useAuthStore from '../../store/authStore';
import { hasPermission } from '../../config/routePermissions';

const { Text } = Typography;

function RolePermission() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const can = (key) => hasPermission(user, key);

  const [state, setState] = useState({ list: [], loading: false });
  const [groups, setGroups] = useState({});
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const [open, setOpen] = useState(false);
  const [activeRole, setActiveRole] = useState(null);
  const [selected, setSelected] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);

  // ==== Fetch roles (each already includes its current `permissions`) ====
  const fetchRoles = useCallback(async () => {
    setState(s => ({ ...s, loading: true }));
    try {
      const res = await api.get('roles', { params: { per_page: 1000 } });
      setState({ list: res.data?.data?.data || [], loading: false });
    } catch {
      message.error('Failed to load data.');
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  // ==== Fetch permissions grouped by category, for the assign modal ====
  const fetchGroups = useCallback(async () => {
    try {
      const res = await api.get('permissions/grouped');
      setGroups(res.data?.data || {});
    } catch {
      message.error('Failed to load permissions.');
    }
  }, []);

  useEffect(() => { fetchRoles(); fetchGroups(); }, [fetchRoles, fetchGroups]);

  // ─── Open manage-permissions modal ────────────────────────
  const openManage = (role) => {
    setActiveRole(role);
    setSelected((role.permissions || []).map(p => p.id));
    setOpen(true);
  };

  const toggle = (id, checked) => {
    setSelected(prev =>
      checked
        ? [...new Set([...prev, id])]
        : prev.filter(x => x !== id)
    );
  };

  const toggleGroup = (perms, checked) => {
    const ids = perms.map(p => p.id);

    if (checked) {
      setSelected(prev => [
        ...new Set([...prev, ...ids])
      ]);
    } else {
      setSelected(prev =>
        prev.filter(id => !ids.includes(id))
      );
    }
  };

  // ─── Save (sync) ──────────────────────────────────────────
  const handleSave = async () => {
    try {
      setBtnLoading(true);
      await api.post(`roles/${activeRole.id}/permissions/sync`, { permission_ids: selected });
      message.success(t('updated_succes'));
      setOpen(false);
      fetchRoles();
    } catch {
      message.error(t('error'));
    } finally {
      setBtnLoading(false);
    }
  };

  // ─── Filter ──────────────────────────────────────────────
  const filtered = state.list.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.key?.toLowerCase().includes(search.toLowerCase())
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
      title: t('lb_name'),
      dataIndex: 'name',
      render: (v) => <Text strong>{v}</Text>,
    },
    {
      title: t('lb_key'),
      dataIndex: 'key',
      render: (v) => <Text code>{v}</Text>,
    },
    {
      title: t('status'),
      dataIndex: 'status',
      align: 'center',
      width: 100,
      render: (v) =>
        v ? <Tag color="success">{t('active')}</Tag> : <Tag color="default">{t('inactive')}</Tag>,
    },
    {
      title: t('permissions'),
      align: 'center',
      width: 140,
      render: (_, record) => <Tag color="blue">{record.permissions?.length || 0}</Tag>,
    },
    {
      title: t('users'),
      align: 'center',
      width: 120,
      render: (_, record) => <Tag color="orange">{record.users_count || 0}</Tag>,
    },
    {
      title: t('action'),
      align: 'center',
      width: 180,
      render: (_, record) => (
        can('EDIT_ROLE_PERMISSION') && (
          <Button
            type="primary"
            icon={<KeyOutlined />}
            size="small"
            style={{ background: NAVY, fontSize: 11 }}
            onClick={() => openManage(record)}
          >
            {t('manage_permissions')}
          </Button>
        )
      ),
    },
  ];

  if (state.loading && state.list.length === 0) {
    return <WaveLoading minHeight={600} />;
  }
 
  return (
    <div>
      <Flex  justify='space-between'  style={{marginBottom:16}} >
        <Text strong style={{ fontSize: 18 }}> {t('role_permission')}  </Text>
        <Space>
          <Input
            placeholder={`${t('search')}...`}
            prefix={<SearchOutlined />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            allowClear
            style={{ width: 220 }}
          />
          <Tooltip title={t('refresh')}>
            <Button icon={<ReloadOutlined />} onClick={() => { fetchRoles(); fetchGroups(); }} />
          </Tooltip>
        </Space>
      </Flex>
      
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
        width={1100}
        title={`គ្រប់គ្រងសិទ្ធិ — ${activeRole?.name || ''}`}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSave}
        okText={t('save')}
        cancelText={t('cancel')}
        confirmLoading={btnLoading}
        okButtonProps={{ style: { background: '#0f3460', borderColor: '#0f3460' } }}
        destroyOnClose
      >
        <div style={{ maxHeight: 600, overflowY: 'auto', padding: '4px 0' }}>
          {Object.keys(groups).length === 0 && (
            <Text type="secondary">{t('no_data')}</Text>
          )}

          {/* ✅ Grid layout — Card per group */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 10,
            }}
          >
            {Object.entries(groups).map(([groupName, perms]) => {
              const ids = perms.map(p => p.id);

              const checkedCount = ids.filter(id =>
                selected.includes(id)
              ).length;

              const checkAll = checkedCount === ids.length;

              const indeterminate =
                checkedCount > 0 &&
                checkedCount < ids.length;

              return (
                <div
                  key={groupName}
                  style={{
                    border: '0.5px solid #e5e7eb',
                    borderRadius: 10,
                    padding: 12,
                    // background: '#fff',
                  }}
                >
                  <div
                    style={{
                      marginBottom: 10,
                      paddingBottom: 8,
                      borderBottom: '0.5px solid #e5e7eb',
                    }}
                  >
                    <Checkbox
                      checked={checkAll}
                      indeterminate={indeterminate}
                      onChange={(e) =>
                        toggleGroup(perms, e.target.checked)
                      }
                    >
                      <Text strong style={{ fontSize: 13 }}>
                        {groupName}
                      </Text>
                    </Checkbox>
                  </div>

                  {perms.map((perm) => (
                    <div key={perm.id} style={{ marginBottom: 7 ,marginLeft:14 }}>
                      <Checkbox
                        checked={selected.includes(perm.id)}
                        onChange={(e) =>
                          toggle(perm.id, e.target.checked)
                        }
                        style={{ fontSize: 12 }}
                      >
                        {perm.name}
                      </Checkbox>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </Modal>  
    </div>
  );
}

export default RolePermission;
