import React, { useEffect, useState } from 'react';
import { Table, Button, message, Typography, Breadcrumb, Select, Space, Popconfirm, Pagination, Flex } from 'antd';
import { PlusOutlined, SaveOutlined, EditOutlined, ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../../api/axios';
import '../../../css/TableStyle.css';

const { Text } = Typography;

export default function Health() {
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

  function calcBMI(row) {
    const w = parseFloat(row.weight);
    const h = parseFloat(row.height);
    if (!w || !h) return '';
    const bmi = w / ((h / 100) ** 2);
    const val = bmi.toFixed(1);
    if (bmi < 18.5) return `${val} (ស្គម)`;
    if (bmi < 25) return `${val} (ធម្មតា)`;
    if (bmi < 30) return `${val} (លើស)`;
    return `${val} (ធាត់)`;
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
    { title: 'No', render: (_, __, i) => i + 1, width: 55 },
    {
      title: 'Check Date',
      render: (_, r) => (r.health_check_date ? dayjs(r.health_check_date).format('DD/MM/YYYY') : '—'),
    },
    { title: 'Weight', dataIndex: 'weight' },
    { title: 'Height', dataIndex: 'height' },
    { title: 'BMI', dataIndex: 'bmi_standard_level' },
    { title: 'Blood Pressure', dataIndex: 'blood_pressure' },
    { title: 'Physical Condition', dataIndex: 'physical_condition' },
    { title: 'Vaccination', dataIndex: 'vaccination' },
    { title: 'Chronic Disease', dataIndex: 'chronic_disease' },
    { title: 'Regular Medication', dataIndex: 'regular_medication' },
    { title: 'Assigned Doctor', dataIndex: 'assigned_doctor' },
    {
      title: 'Next Check',
      render: (_, r) => (r.next_health_check_date ? dayjs(r.next_health_check_date).format('DD/MM/YYYY') : '—'),
    },
  ];

  // ================= LIST VIEW =================
  if (view === 'list') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text strong style={{ fontSize: 18 }}>Health</Text>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Add</Button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
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
                    <Text style={{ marginLeft: 16 }}>ID: {group.personal_info?.id_number}</Text>
                    {group.personal_info?.military_id && (
                      <Text style={{ marginLeft: 16 }}>
                        Military ID: {group.personal_info?.military_id}
                      </Text>
                    )}
                  </span>
                  <Space>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => openEdit(group.personal_info?.id)}
                    >
                      Edit
                    </Button>
                    <Popconfirm
                      title="លុប records ទាំងអស់?"
                      description={`លុប health ទាំងអស់របស់ ${group.personal_info?.name_kh}?`}
                      onConfirm={() => deleteAll(group.records)}
                      okText="លុប"
                      cancelText="បោះបង់"
                      okButtonProps={{ danger: true }}
                    >
                      <Button danger icon={<DeleteOutlined />}>
                        Delete All
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
                total={groupedData.length}
                onChange={(page) => setCurrentPage(page)}
                showTotal={(total) => `សរុប ${total} personnel`}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
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
                Health
              </span>
            ),
          },
          { title: isAdd ? 'Add' : 'Edit' },
        ]}
      />

      {/* SELECT PERSONNEL — Add mode only */}
      {isAdd && (
        <div style={{ marginBottom: 12 }}>
          <Text strong style={{ marginRight: 8 }}>Select Personnel:</Text>
          <Select
            showSearch
            placeholder="ជ្រើសរើស Personnel"
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
          <Text style={{ marginLeft: 16 }}>ID: {personalInfo.id_number}</Text>
          {personalInfo.military_id && (
            <Text style={{ marginLeft: 16 }}>Military ID: {personalInfo.military_id}</Text>
          )}
        </div>
      )}

      {/* TABLE FORM */}
      <div className="contianer-wrapper">
        <div className="contianer-title">Health History</div>
        <table className="contianer-table">
          <thead>
            <tr>
              <th>ថ្ងៃពិនិត្យសុខភាព</th>
              <th>ទម្ងន់ (kg)</th>
              <th>កម្ពស់ (cm)</th>
              <th>កំរិតស្តង់ដា</th>
              <th>សម្ពាធឈាម</th>
              <th>កាយសម្បទា</th>
              <th>វ៉ាក់សាំង</th>
              <th>ជំងឺប្រចាំកាយ</th>
              <th>ថ្នាំប្រចាំកាយ</th>
              <th>គ្រូពេទ្យប្រចាំ</th>
              <th>ថ្ងៃពិនិត្យសុខភាពបន្ទាប់</th>
              <th>Action</th>
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
                <td>{calcBMI(row) || '—'}</td>
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
                      <Button danger>Delete</Button>
                    </Popconfirm>
                  ) : (
                    <Button danger onClick={() => removeRow(i)}>
                      Delete
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
            Add Row
          </Button>

          <div style={{display: 'flex', gap: 10 }}>
            <Button onClick={() => setView('list')}>
              <ArrowLeftOutlined /> Back
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={saving}
              onClick={saveAll}
            >
              Save All
            </Button>
          </div>
        </Flex>
        
      </div>
    </div>
  );
}
