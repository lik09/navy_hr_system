import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Tooltip, message, Typography, Breadcrumb, Select, Space, Popconfirm, Pagination, Flex } from 'antd';
import { PlusOutlined, SaveOutlined, EditOutlined, ArrowLeftOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../../api/axios';
import WaveLoading from '../../components/ui/WaveLoading';
import '../../../css/TableStyle.css';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../store/authStore';
import { hasPermission } from '../../config/routePermissions';

const { Text } = Typography;

export default function Mission() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const can = (key) => hasPermission(user, key);
  const [view, setView] = useState('list');
  const [groupedData, setGroupedData] = useState([]);
  const [personnelList, setPersonnelList] = useState([]);
  const [personalInfo, setPersonalInfo] = useState(null);
  const [selectedPersonnelId, setSelectedPersonnelId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [rows, setRows] = useState([emptyRow()]);
  const [searchText, setSearchText] = useState('');

  // ================= PAGINATION STATE =================
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const filteredGroups = groupedData.filter((g) => {
    if (!searchText.trim()) return true;
    const q = searchText.trim().toLowerCase();
    const p = g.personal_info;
    return [p?.name_kh, p?.name, p?.id_number, p?.military_id]
      .some(v => (v || '').toLowerCase().includes(q));
  });
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function emptyRow() {
    return {
      id: null, start_date: '', duration: '', mission_name: '',
      mission_type: '', assigned_unit: '', role_during_mission: '', result: '',
    };
  }

  function mapRow(r) {
    return {
      id: r.id,
      start_date: r.start_date ? dayjs(r.start_date).format('YYYY-MM-DD') : '',
      duration: r.duration || '',
      mission_name: r.mission_name || '',
      mission_type: r.mission_type || '',
      assigned_unit: r.assigned_unit || '',
      role_during_mission: r.role_during_mission || '',
      result: r.result || '',
    };
  }

  // ================= FETCH =================
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/missions');
      setGroupedData(res.data || []);
      setCurrentPage(1); // reset page on reload
    } catch {
      message.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonnel = async () => {
    try {
      const res = await api.get('/personnel-info');
      setPersonnelList(res.data || []);
    } catch {}
  };

  useEffect(() => { fetchData(); fetchPersonnel(); }, []);

  // ================= OPEN ADD =================
  const openAdd = () => {
    setIsAdd(true);
    setSelectedPersonnelId(null);
    setPersonalInfo(null);
    setRows([emptyRow()]);
    setView('form');
  };

  // ================= SELECT PERSONNEL =================
  const onSelectPersonnel = async (personnelId) => {
    setSelectedPersonnelId(personnelId);
    try {
      const res = await api.get(`/missions?personal_info_id=${personnelId}`);
      const group = res.data[0] || null;
      setPersonalInfo(group?.personal_info || null);
      const existing = group?.records || [];
      setRows(existing.length > 0 ? existing.map(mapRow) : [emptyRow()]);
    } catch {
      setRows([emptyRow()]);
    }
  };

  // ================= OPEN EDIT =================
  const openEdit = async (personalInfoId) => {
    setIsAdd(false);
    setSelectedPersonnelId(personalInfoId);
    try {
      const res = await api.get(`/missions?personal_info_id=${personalInfoId}`);
      const group = res.data[0] || null;
      setPersonalInfo(group?.personal_info || null);
      setRows((group?.records || []).map(mapRow));
    } catch {
      message.error('Error loading records');
    }
    setView('form');
  };

  // ================= DELETE ALL =================
  const deleteAll = async (records) => {
    try {
      await Promise.all(
        records.map((r) => api.delete(`/missions/${r.id}`))
      );
      message.success('លុបបានជោគជ័យ');
      await fetchData();
    } catch {
      message.error('Delete failed');
    }
  };

  // ================= ROW ACTIONS =================
  const addRow = () => setRows([...rows, emptyRow()]);

  const updateRow = (i, field, val) => {
    const r = [...rows]; r[i][field] = val; setRows(r);
  };

  const removeRow = async (i) => {
    if (rows.length === 1) return message.warning('ត្រូវមានយ៉ាងហោចណាស់ 1 row');
    const row = rows[i];
    if (row.id) {
      try {
        await api.delete(`/missions/${row.id}`);
        message.success('លុបបានជោគជ័យ');
      } catch {
        return message.error('Delete failed');
      }
    }
    setRows(rows.filter((_, idx) => idx !== i));
  };

  // ================= SAVE =================
  const saveAll = async () => {
    if (!selectedPersonnelId) return message.error('សូម Select Personnel មុនសិន');
    setSaving(true);
    try {
      await api.post('/missions', {
        personal_info_id: selectedPersonnelId,
        records: rows,
      });
      message.success('រក្សាទុកបានជោគជ័យ');
      await fetchData();
      setView('list');
    } catch {
      message.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  // ================= COLUMNS =================
  const recordColumns = [
    { title: t('tb_no'), render: (_, __, i) => i + 1, width: 55 },
    {
      title: t('start_date'),
      render: (_, r) => (r.start_date ? dayjs(r.start_date).format('DD/MM/YYYY') : '—'),
    },
    { title: t('duration'), dataIndex: 'duration' },
    { title: t('mission_name'), dataIndex: 'mission_name' },
    { title: t('mission_type'), dataIndex: 'mission_type' },
    { title: t('assigned_unit'), dataIndex: 'assigned_unit' },
    { title: t('role'), dataIndex: 'role_during_mission' },
    { title: t('result') , dataIndex: 'result' },
  ];

  if (loading) return <WaveLoading minHeight={600} />;

  // ================= LIST VIEW =================
  if (view === 'list') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text strong style={{ fontSize: 18 }}>{t('mission')}</Text>
          {can('ADD_MISSION_HISTORY') && (
            <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>{t('add')}</Button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <Input
            placeholder={`${t('search')}...`}
            prefix={<SearchOutlined/>}
            value={searchText}
            onChange={e => { setSearchText(e.target.value); setCurrentPage(1); }}
            allowClear
            style={{ width: 220 }}
          />
          <Tooltip title={t('refresh')}>
            <Button icon={<ReloadOutlined/>} onClick={fetchData} />
          </Tooltip>
        </div>

        <>
            {/* GROUPS */}
            {paginatedGroups.map((group) => (
              <div key={group.personal_info?.id} style={{ marginBottom: 32 }}>

                {/* Personal Info Header */}
                <div className='table-header-bg-color' style={{
                  padding: '8px 12px',
                  borderRadius: '6px 6px 0 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid #d9d9d9',
                  borderBottom: 'none',
                }}>
                  <span>
                    <Text strong>{group.personal_info?.name_kh} ({group.personal_info?.name})</Text>
                    <Text style={{ marginLeft: 16 }}>{t('lb_id_number')} {group.personal_info?.id_number}</Text>
                    {group.personal_info?.military_id && (
                      <Text style={{ marginLeft: 16 }}>
                        {t('military_id')}: {group.personal_info?.military_id}
                      </Text>
                    )}
                  </span>
                  <Space>
                    {can('EDIT_MISSION_HISTORY') && (
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => openEdit(group.personal_info?.id)}
                    >
                      {t('edit')}
                    </Button>
                    )}
                    {can('DELETE_MISSION_HISTORY') && (
                    <Popconfirm
                      title="លុប records ទាំងអស់?"
                      description={`លុប mission ទាំងអស់របស់ ${group.personal_info?.name_kh}?`}
                      onConfirm={() => deleteAll(group.records)}
                      okText="លុប"
                      cancelText="បោះបង់"
                      okButtonProps={{ danger: true }}
                    >
                      <Button danger icon={<DeleteOutlined />}>
                        {t('delete_all')}
                      </Button>
                    </Popconfirm>
                    )}
                  </Space>
                </div>

                {/* Records Table */}
                <Table
                  dataSource={group.records}
                  columns={recordColumns}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  style={{ border: '1px solid #d9d9d9' }}
                />
              </div>
            ))}

            {/* GROUP PAGINATION */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredGroups.length}
                onChange={(page) => setCurrentPage(page)}
                showTotal={(total) => `${t('total')} ${total} ${t('record')}`}
                showSizeChanger={false}
              />
            </div>
        </>
      </div>
    );
  }

  // ================= FORM VIEW =================
  return (
    <div>
      <Breadcrumb
        style={{ marginBottom: 12 }}
        items={[
          {
            title: (
              <span onClick={() => setView('list')} style={{ cursor: 'pointer' }}>
                {t('mission')}
              </span>
            ),
          },
          { title: isAdd ? t('add') : t('edit') },
        ]}
      />

      {/* SELECT PERSONNEL — Add mode only */}
      {isAdd && (
        <div style={{ marginBottom: 12 }}>
          <Text strong style={{ marginRight: 8 }}>{t('select_military_members')} :</Text>
          <Select
            showSearch
            placeholder={t('select_military_members')}
            style={{ width: 320 }}
            value={selectedPersonnelId}
            onChange={onSelectPersonnel}
            optionFilterProp="label"
            options={personnelList.map((p) => ({
              value: p.id,
              label: `${p.name_kh} (${p.id_number})`,
            }))}
          />
        </div>
      )}

      {/* PERSONAL INFO DISPLAY */}
      {personalInfo && (
        <div className='table-header-bg-color' style={{
          // background: '#f0f4ff',
          padding: '8px 12px',
          marginBottom: 12,
          borderRadius: 6,
        }}>
          <Text strong>{personalInfo.name_kh} ({personalInfo.name})</Text>
          <Text style={{ marginLeft: 16 }}> {t('lb_id_number')} {personalInfo.id_number}</Text>
          {personalInfo.military_id && (
            <Text style={{ marginLeft: 16 }}>{t('military_id')} : {personalInfo.military_id}</Text>
          )}
        </div>
      )}

      {/* TABLE FORM */}
      <div className="contianer-wrapper">
        <div className="contianer-title"> {t('mission')} </div>
        <table className="contianer-table">
          <thead>
            <tr>
              <th>{t('start_date')}</th>
              <th>{t('duration')}</th>
              <th>{t('mission_name')}</th>
              <th>{t('mission_type')}</th>
              <th>{t('assigned_unit')}</th>
              <th>{t('role_during_filling')}</th>
              <th>{t('result')}</th>
              <th>{t("action")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td>
                  <input
                    type="date"
                    className="contianer-input"
                    value={row.start_date}
                    onChange={(e) => updateRow(i, 'start_date', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.duration}
                    onChange={(e) => updateRow(i, 'duration', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.mission_name}
                    onChange={(e) => updateRow(i, 'mission_name', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.mission_type}
                    onChange={(e) => updateRow(i, 'mission_type', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.assigned_unit}
                    onChange={(e) => updateRow(i, 'assigned_unit', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.role_during_mission}
                    onChange={(e) => updateRow(i, 'role_during_mission', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.result}
                    onChange={(e) => updateRow(i, 'result', e.target.value)}
                  />
                </td>
                <td>
                  {row.id ? (
                    <Popconfirm
                      title="លុប record នេះ?"
                      onConfirm={() => removeRow(i)}
                      okText="លុប"
                      cancelText="បោះបង់"
                      okButtonProps={{ danger: true }}
                    >
                      <Button danger>{t('delete')}</Button>
                    </Popconfirm>
                  ) : (
                    <Button danger onClick={() => removeRow(i)}>
                      {t('delete')}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* button ACTIONS */}
        <Flex justify='space-between' style={{ marginTop:10 }}>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addRow}
          >
            {t('add_row')}
          </Button>

          <div style={{ display: 'flex', gap: 10 }}>
            <Button onClick={() => setView('list')}>
              <ArrowLeftOutlined /> {t('back')}
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={saving}
              onClick={saveAll}
            >
              {t('save_all')}
            </Button>
          </div>
        </Flex>
    
      </div> 
    </div>
  );
}
