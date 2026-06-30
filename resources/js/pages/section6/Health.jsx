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
import { NAVY } from '../../components/section1/personalInfoStyles';

const { Text } = Typography;

export default function Health() {
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
      id: null, health_check_date: '', weight: '', height: '',
      bmi_standard_level: '', blood_pressure: '', physical_condition: '',
      vaccination: '', chronic_disease: '', regular_medication: '',
      assigned_doctor: '', next_health_check_date: '',
    };
  }

  function mapRow(r) {
    return {
      id: r.id,
      health_check_date: r.health_check_date ? dayjs(r.health_check_date).format('YYYY-MM-DD') : '',
      weight: r.weight ?? '',
      height: r.height ?? '',
      bmi_standard_level: r.bmi_standard_level ?? '',
      blood_pressure: r.blood_pressure || '',
      physical_condition: r.physical_condition || '',
      vaccination: r.vaccination || '',
      chronic_disease: r.chronic_disease || '',
      regular_medication: r.regular_medication || '',
      assigned_doctor: r.assigned_doctor || '',
      next_health_check_date: r.next_health_check_date ? dayjs(r.next_health_check_date).format('YYYY-MM-DD') : '',
    };
  }

  // ================= FETCH =================
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/health');
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
      const res = await api.get(`/health?personal_info_id=${personnelId}`);
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
      const res = await api.get(`/health?personal_info_id=${personalInfoId}`);
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
        records.map((r) => api.delete(`/health/${r.id}`))
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
        await api.delete(`/health/${row.id}`);
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
      await api.post('/health', {
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
      title: t('check_date'),
      render: (_, r) => (r.health_check_date ? dayjs(r.health_check_date).format('DD/MM/YYYY') : '—'),
    },
    { title: t('weight'), dataIndex: 'weight' },
    { title: t('height'), dataIndex: 'height' },
    { title: t('bmi'), dataIndex: 'bmi_standard_level' },
    { title: t('blood_pressure'), dataIndex: 'blood_pressure' },
    { title: t('physical_condition'), dataIndex: 'physical_condition' },
    { title: t('vaccination'), dataIndex: 'vaccination' },
    { title: t('chronic_disease'), dataIndex: 'chronic_disease' },
    { title: t('regular_medication'), dataIndex: 'regular_medication' },
    { title: t('assigned_doctor'), dataIndex: 'assigned_doctor' },
    {
      title: t('next_check'),
      render: (_, r) => (r.next_health_check_date ? dayjs(r.next_health_check_date).format('DD/MM/YYYY') : '—'),
    },
  ];

  if (loading) return <WaveLoading minHeight={600} />;

  // ================= LIST VIEW =================
  if (view === 'list') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text strong style={{ fontSize: 18 }}> {t('health')} </Text>
          {can('ADD_HEALTH_INFORMATION') && (
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
                    <Text style={{ marginLeft: 16 }}> {t('lb_id_number')} {group.personal_info?.id_number}</Text>
                    {group.personal_info?.military_id && (
                      <Text style={{ marginLeft: 16 }}>
                        {t('military_id')} : {group.personal_info?.military_id}
                      </Text>
                    )}
                  </span>
                  <Space>
                    {can('EDIT_HEALTH_INFORMATION') && (
                      <Button
                        style={{ color:NAVY ,borderColor: NAVY }}
                        icon={<EditOutlined />}
                        onClick={() => openEdit(group.personal_info?.id)}
                      >
                        {t('edit')}
                      </Button>
                    )}
                    {can('DELETE_HEALTH_INFORMATION') && (
                      <Popconfirm
                        title="លុប records ទាំងអស់?"
                        description={`លុប health ទាំងអស់របស់ ${group.personal_info?.name_kh}?`}
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
                  scroll={{ x: 'max-content' }}
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
                {t("health")}
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
            placeholder= {t('select_military_members')}
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
          <Text style={{ marginLeft: 16 }}>{t('lb_id_number')} {personalInfo.id_number}</Text>
          {personalInfo.military_id && (
            <Text style={{ marginLeft: 16 }}>{t('military_id')} : {personalInfo.military_id}</Text>
          )}
        </div>
      )}

      {/* TABLE FORM */}
      <div className="contianer-wrapper">
        <div className="contianer-title">{t('health')}</div>
        <table className="contianer-table">
          <thead>
            <tr>
              <th>{t('check_date')}</th>
              <th>{t('weight')}</th>
              <th>{t('height')}</th>
              <th>{t('bmi')}</th>
              <th>{t('blood_pressure')}</th>
              <th>{t('physical_condition')}</th>
              <th>{t('vaccination')}</th>
              <th>{t('chronic_disease')}</th>
              <th>{t('regular_medication')}</th>
              <th>{t('assigned_doctor')}</th>
              <th>{t('next_check')}</th>
              <th>{t('action')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td>
                  <input
                    type="date"
                    className="contianer-input"
                    value={row.health_check_date}
                    onChange={(e) => updateRow(i, 'health_check_date', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.weight}
                    onChange={(e) => updateRow(i, 'weight', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.height}
                    onChange={(e) => updateRow(i, 'height', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.bmi_standard_level}
                    onChange={(e) => updateRow(i, 'bmi_standard_level', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.blood_pressure}
                    onChange={(e) => updateRow(i, 'blood_pressure', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.physical_condition}
                    onChange={(e) => updateRow(i, 'physical_condition', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.vaccination}
                    style={{lineHeight:1.5 }}
                    onChange={(e) => updateRow(i, 'vaccination', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.chronic_disease}
                    onChange={(e) => updateRow(i, 'chronic_disease', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.regular_medication}
                    onChange={(e) => updateRow(i, 'regular_medication', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.assigned_doctor}
                    onChange={(e) => updateRow(i, 'assigned_doctor', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    className="contianer-input"
                    
                    value={row.next_health_check_date}
                    onChange={(e) => updateRow(i, 'next_health_check_date', e.target.value)}
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

          <div style={{display: 'flex', gap: 10 }}>
            <Button onClick={() => setView('list')}>
              <ArrowLeftOutlined /> {t('back')}
            </Button>
            <Button
              type="primary"
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
