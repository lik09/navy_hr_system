import React, { useEffect, useState } from 'react';
import { Table, Button, message, Typography, Breadcrumb, Select, Space, Popconfirm, Pagination, Flex } from 'antd';
import { PlusOutlined, SaveOutlined, EditOutlined, ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../../api/axios';
import '../../../css/TableStyle.css';

const { Text } = Typography;

export default function MilitaryService() {
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
      id: null, start_date: '', end_date: '',
      military_rank: '', position: '', office: '',
      military_unit: '', place: '',
    };
  }

  function mapRow(r) {
    return {
      id: r.id,
      start_date: r.start_date ? dayjs(r.start_date).format('YYYY-MM-DD') : '',
      end_date: r.end_date || '',
      military_rank: r.military_rank || '',
      position: r.position || '',
      office: r.office || '',
      military_unit: r.military_unit || '',
      place: r.place || '',
    };
  }

  // ================= FETCH =================
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/military-service-histories');
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
      const res = await api.get(`/military-service-histories?personal_info_id=${personnelId}`);
      const group = res.data[0] || null;
      setPersonalInfo(group?.personal_info || null);
      const existing = group?.histories || [];
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
      const res = await api.get(`/military-service-histories?personal_info_id=${personalInfoId}`);
      const group = res.data[0] || null;
      setPersonalInfo(group?.personal_info || null);
      setRows((group?.histories || []).map(mapRow));
    } catch {
      message.error('Error loading records');
    }
    setView('form');
  };

  // ================= DELETE ALL =================
  const deleteAll = async (histories) => {
    try {
      await Promise.all(
        histories.map((h) => api.delete(`/military-service-histories/${h.id}`))
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
        await api.delete(`/military-service-histories/${row.id}`);
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
      await api.post('/military-service-histories', {
        personal_info_id: selectedPersonnelId,
        histories: rows,
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
  const historyColumns = [
    { title: 'No', render: (_, __, i) => i + 1, width: 55 },
    {
      title: 'Date',
      render: (_, r) => {
        const s = r.start_date ? dayjs(r.start_date).format('DD/MM/YYYY') : '—';
        const e = r.end_date || '';
        return `${s} - ${e}`;
      },
    },
    { title: 'Rank', dataIndex: 'military_rank' },
    { title: 'Position', dataIndex: 'position' },
    { title: 'Office', dataIndex: 'office' },
    { title: 'Unit', dataIndex: 'military_unit' },
    { title: 'Place', dataIndex: 'place' },
  ];

  // ================= LIST VIEW =================
  if (view === 'list') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text strong style={{ fontSize: 18 }}>Military Service</Text>
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
                      description={`លុប history ទាំងអស់របស់ ${group.personal_info?.name_kh}?`}
                      onConfirm={() => deleteAll(group.histories)}
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

                {/* Histories Table */}
                <Table
                  dataSource={group.histories}
                  columns={historyColumns}
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
                Military Service
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
        <div className="contianer-title">Military Service History</div>
        <table className="contianer-table">
          <thead>
            <tr>
              <th colSpan={2}>រយៈកាលការងារ</th>
              <th>ឋានន្តរសក្តិ</th>
              <th>មុខតំណែង</th>
              <th>ការិយាល័យ</th>
              <th>កងឯកភាព</th>
              <th>ទីកន្លែង</th>
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
                    value={row.start_date}
                    onChange={(e) => updateRow(i, 'start_date', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    placeholder="DD/MM/YYYY ឬ បច្ចុប្បន្ន"
                    value={row.end_date}
                    onChange={(e) => updateRow(i, 'end_date', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.military_rank}
                    onChange={(e) => updateRow(i, 'military_rank', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.position}
                    onChange={(e) => updateRow(i, 'position', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.office}
                    onChange={(e) => updateRow(i, 'office', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.military_unit}
                    onChange={(e) => updateRow(i, 'military_unit', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="contianer-input"
                    value={row.place}
                    onChange={(e) => updateRow(i, 'place', e.target.value)}
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

          <div style={{  display: 'flex', gap: 10 }}>
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