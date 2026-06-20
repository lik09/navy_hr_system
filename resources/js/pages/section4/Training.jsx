import React, { useEffect, useState } from 'react';
import { Table, Button, message, Typography, Breadcrumb, Select, Space, Popconfirm, Pagination, Flex } from 'antd';
import { PlusOutlined, SaveOutlined, EditOutlined, ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../api/axios';
import WaveLoading from '../../components/ui/WaveLoading';
import '../../../css/TableStyle.css';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

export default function Training() {
  const { t } = useTranslation();
  const [view, setView] = useState('list');
  const [groupedData, setGroupedData] = useState([]);
  const [personnelList, setPersonnelList] = useState([]);
  const [personalInfo, setPersonalInfo] = useState(null);
  const [selectedPersonnelId, setSelectedPersonnelId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [rows, setRows] = useState([emptyRow()]);

  // ================= PAGINATION STATE =================
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const paginatedGroups = groupedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function emptyRow() {
    return {
      id: null, duration_study: '', register_date: '',
      specialty_type: '', specialty: '', education_level: '',
      institution_name: '', is_domestic: '', is_overseas: '',
    };
  }

  function mapRow(r) {
    return {
      id: r.id,
      duration_study: r.duration_study || '',
      register_date: r.register_date || '',
      specialty_type: r.specialty_type || '',
      specialty: r.specialty || '',
      education_level: r.education_level || '',
      institution_name: r.institution_name || '',
      is_domestic: r.is_domestic || '',
      is_overseas: r.is_overseas || '',
    };
  }

  // ================= FETCH =================
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/specialized-trainings');
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
      const res = await api.get(`/specialized-trainings?personal_info_id=${personnelId}`);
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
      const res = await api.get(`/specialized-trainings?personal_info_id=${personalInfoId}`);
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
        records.map((r) => api.delete(`/specialized-trainings/${r.id}`))
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
        await api.delete(`/specialized-trainings/${row.id}`);
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
      await api.post('/specialized-trainings', {
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
    { title: t('duration'), dataIndex: 'duration_study' },
    { title: t('register_date'), dataIndex: 'register_date' },
    { title: t('specialty_type'), dataIndex: 'specialty_type' },
    { title: t('specialty'), dataIndex: 'specialty' },
    { title: t('lb_level'), dataIndex: 'education_level' },
    { title: t('institution'), dataIndex: 'institution_name' },
    { title: t('domestic'), dataIndex: 'is_domestic' },
    { title: t('overseas'), dataIndex: 'is_overseas' },
  ];

  if (loading) return <WaveLoading minHeight={600} />;

  // ================= LIST VIEW =================
  if (view === 'list') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text strong style={{ fontSize: 18 }}>{t('training')} </Text>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>{t('add')}</Button>
        </div>

        <>
            {/* GROUPS */}
            {paginatedGroups.map((group) => (
              <div key={group.personal_info?.id} style={{ marginBottom: 32 }}>

                {/* Personal Info Header */}
                <div ame='table-header-bg-color' style={{
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
                        {t('military_id')} : {group.personal_info?.military_id}
                      </Text>
                    )}
                  </span>
                  <Space>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => openEdit(group.personal_info?.id)}
                    >
                      {t('edit')}
                    </Button>
                    <Popconfirm
                      title="លុប records ទាំងអស់?"
                      description={`លុប training ទាំងអស់របស់ ${group.personal_info?.name_kh}?`}
                      onConfirm={() => deleteAll(group.records)}
                      okText="លុប"
                      cancelText="បោះបង់"
                      okButtonProps={{ danger: true }}
                    >
                      <Button danger icon={<DeleteOutlined />}>
                        {t('delete_all')}
                      </Button>
                    </Popconfirm>
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
                total={groupedData.length}
                onChange={(page) => setCurrentPage(page)}
                showTotal={(total) => `${t(total)} ${total} ${t('record')}`}
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
                {t('training')}
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
        <div className="contianer-title"> {t('training')} </div>
        <table className="contianer-table">
          <thead>
            <tr>
              <th colSpan={2}>{t('study_period')}</th>
              <th colSpan={3}>{t('type_education')}</th>
              <th colSpan={4}>{t('study_place')}</th>
              
            </tr>

            <tr>
              <th>{t('duration')}</th>
              <th>{t('register_date')}</th>
              <th>{t('specialty_type')}</th>
              <th>{t('specialty')}</th>
              <th>{t('lb_level')}</th>
              <th>{t('institution')}</th>
              <th>{t('domestic')}</th>
              <th>{t('overseas')}</th>
              <th>{t('action')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td>
                  <input
                    className="contianer-input"
                    value={row.duration_study}
                    onChange={(e) => updateRow(i, 'duration_study', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.register_date}
                    onChange={(e) => updateRow(i, 'register_date', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.specialty_type}
                    onChange={(e) => updateRow(i, 'specialty_type', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.specialty}
                    onChange={(e) => updateRow(i, 'specialty', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.education_level}
                    onChange={(e) => updateRow(i, 'education_level', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.institution_name}
                    onChange={(e) => updateRow(i, 'institution_name', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.is_domestic}
                    onChange={(e) => updateRow(i, 'is_domestic', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.is_overseas}
                    onChange={(e) => updateRow(i, 'is_overseas', e.target.value)}
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
