import React, { useEffect, useState } from 'react';
import {
  Table, Button, Form, Input, Select,
  Row, Col, Upload, message, Space, InputNumber,
  Descriptions, Tag, Typography, Popconfirm, Breadcrumb,
  Flex, Dropdown,
} from 'antd';
import {
  PlusOutlined, SaveOutlined, EditOutlined, EyeOutlined,
  DeleteOutlined, CameraOutlined, ArrowLeftOutlined,
  DownloadOutlined, FilePdfOutlined, FileExcelOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import api, { apiFormData, downloadFile } from '../../api/axios';
import TblInput from '../../components/ui/TblInput';
import TblDatePicker from '../../components/ui/TblDatePicker';
import WaveLoading from '../../components/ui/WaveLoading';
import { NAVY, BORDER, S, SecTitle } from '../../components/section1/personalInfoStyles';
import PersonalInfoDetail from '../../components/section1/PersonalInfoDetail';
import { formatNumberDisplay } from '../../utils/khmerNumerals';
import '../../../css/Common.css';

const { Text } = Typography;


// ── Location 3-col inside a single <td> ──────────────────────────────────────
const LocationTd = ({ vals, onChange, colSpan = 6, errors = [false, false, false] }) => {
  const { t } = useTranslation();
  return (
    <td style={{ ...S.td, padding: '4px 8px' }} colSpan={colSpan}>
      <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 80px 1fr 120px 1fr', gap: 4, alignItems: 'center' }}>
        <span style={{ fontSize: 16, color: '#888', textAlign: 'center' }}>{t('commune')}</span>
        <TblInput value={vals[0]} onChange={v => onChange(0, v)} placeholder=".................." style={errors[0] ? { border: '1px solid red' } : {}} />
        <span style={{ fontSize: 16, color: '#888', textAlign: 'center' }}>{t('district')}</span>
        <TblInput value={vals[1]} onChange={v => onChange(1, v)} placeholder=".................." style={errors[1] ? { border: '1px solid red' } : {}} />
        <span style={{ fontSize: 16, color: '#888', textAlign: 'center' }}>{t('province')}</span>
        <TblInput value={vals[2]} onChange={v => onChange(2, v)} placeholder=".................." style={errors[2] ? { border: '1px solid red' } : {}} />
      </div>
    </td>
  );
};

// ── Table header for data list ────────────────────────────────────────────────
const th = (extra = {}) => ({
  style: { background: NAVY, color: '#fff', textAlign: 'center', ...extra },
});

// ═════════════════════════════════════════════════════════════════════════════
export default function PersonalInfo() {
  const { t, i18n } = useTranslation();

  const [view,       setView]       = useState('list');
  const [records,    setRecords]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [errors,     setErrors]     = useState({});
  const [editRecord, setEditRecord] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [fileList,   setFileList]   = useState([]);

  // ── Form state (mirrors Word form fields exactly) ──────────────────────────
  const [basic, setBasic] = useState({
    name_kh: '', name: '', gender: 'male', id_number: '',
    date_of_birth: '', military_id: '', civilian_id: '', phone_number: '',
  });
  const [birthLoc,   setBirthLoc]   = useState(['', '', '']);
  const [currentLoc, setCurrentLoc] = useState(['', '', '']);

  const [military, setMilitary] = useState({
    military_enlistment_date: '', military_rank: '', last_date_military_rank: '',
    position: '', military_specialty: '', unit: '',
    military_unit: '', education_level: '', last_position: '',
  });

  const [marital,    setMarital]    = useState(false);
  const [spouse, setSpouse] = useState({
    spouse_name: '', spouse_type: false, spouse_gender: 'male',
    spouse_dob: '', marriage_certificate_number: '', marriage_certificate_date: '',
  });
  const [spouseBirth,   setSpouseBirth]   = useState(['', '', '']);
  const [spouseCurrent, setSpouseCurrent] = useState(['', '', '']);
  const [numChildren,   setNumChildren]   = useState({ total: 0, male: 0, female: 0 });
  const [children,      setChildren]      = useState([]);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await api.get('/personnel-info');
      setRecords(res.data || []);
    } catch { setRecords([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRecords(); }, []);

  // ── Reset form to blank ────────────────────────────────────────────────────
  const resetForm = () => {
    setBasic({ name_kh:'', name:'', gender:'male', id_number:'', date_of_birth:'', military_id:'', civilian_id:'', phone_number:'' });
    setBirthLoc(['','','']);
    setCurrentLoc(['','','']);
    setMilitary({ military_enlistment_date:'', military_rank:'', last_date_military_rank:'', position:'', military_specialty:'', unit:'', military_unit:'', education_level:'', last_position:'' });
    setMarital(false);
    setSpouse({ spouse_name:'', spouse_type:false, spouse_gender:'male', spouse_dob:'', marriage_certificate_number:'', marriage_certificate_date:'' });
    setSpouseBirth(['','','']);
    setSpouseCurrent(['','','']);
    setNumChildren({ total:0, male:0, female:0 });
    setChildren([]);
    setFileList([]);
    setErrors({});
  };

  // ── Open Add ───────────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditRecord(null);
    resetForm();
    setView('form');
  };

  // ── Open Edit ──────────────────────────────────────────────────────────────
  const openEdit = (record) => {
    setEditRecord(record);
    const r = record;
    const mi = r.military_info;
    const fi = r.family_info;

    setBasic({
      name_kh:       r.name_kh       || '',
      name:          r.name          || '',
      gender:        r.gender        || 'male',
      id_number:     r.id_number     || '',
      date_of_birth: r.date_of_birth ? dayjs(r.date_of_birth).format('YYYY-MM-DD') : '',
      military_id:   r.military_id   || '',
      civilian_id:   r.civilian_id   || '',
      phone_number:  r.phone_number  || '',
    });
    setBirthLoc([r.birth_commune||'', r.birth_district||'', r.birth_province||'']);
    setCurrentLoc([r.current_commune||'', r.current_district||'', r.current_province||'']);

    if (mi) {
      setMilitary({
        military_enlistment_date: mi.military_enlistment_date ? dayjs(mi.military_enlistment_date).format('YYYY-MM-DD') : '',
        military_rank:            mi.military_rank            || '',
        last_date_military_rank:  mi.last_date_military_rank  ? dayjs(mi.last_date_military_rank).format('YYYY-MM-DD') : '',
        position:                 mi.position                 || '',
        military_specialty:       mi.military_specialty        || '',
        unit:                     mi.unit                     || '',
        military_unit:            mi.military_unit             || '',
        education_level:          mi.education_level           || '',
        last_position:            mi.last_position             || '',
      });
    } else {
      setMilitary({ military_enlistment_date:'', military_rank:'', last_date_military_rank:'', position:'', military_specialty:'', unit:'', military_unit:'', education_level:'', last_position:'' });
    }

    if (fi) {
      setMarital(!!fi.marital_status);
      setSpouse({
        spouse_name:                  fi.spouse_name                  || '',
        spouse_type:                  fi.spouse_type                  ?? false,
        spouse_gender:                fi.spouse_gender                || 'male',
        spouse_dob:                   fi.spouse_dob                   ? dayjs(fi.spouse_dob).format('YYYY-MM-DD') : '',
        marriage_certificate_number:  fi.marriage_certificate_number  || '',
        marriage_certificate_date:    fi.marriage_certificate_date    ? dayjs(fi.marriage_certificate_date).format('YYYY-MM-DD') : '',
      });
      setSpouseBirth([fi.spouse_birth_commune||'', fi.spouse_birth_district||'', fi.spouse_birth_province||'']);
      setSpouseCurrent([fi.spouse_current_commune||'', fi.spouse_current_district||'', fi.spouse_current_province||'']);
      setNumChildren({ total: fi.number_of_children||0, male: fi.male_children_count||0, female: fi.female_children_count||0 });
      setChildren(fi.children ? fi.children.map(c => ({ id: c.id, name: c.name||'', dob: c.date_of_birth ? dayjs(c.date_of_birth).format('YYYY-MM-DD') : '' })) : []);
    } else {
      setMarital(false);
      setSpouse({ spouse_name:'', spouse_type:false, spouse_gender:'male', spouse_dob:'', marriage_certificate_number:'', marriage_certificate_date:'' });
      setSpouseBirth(['','','']); setSpouseCurrent(['','','']);
      setNumChildren({ total:0, male:0, female:0 }); setChildren([]);
    }

    if (r.photo) setFileList([{ uid:'-1', name:'photo', status:'done', url:`/storage/${r.photo}` }]);
    else setFileList([]);

    setView('form');
  };

  // ── Open View ──────────────────────────────────────────────────────────────
  const openView = (record) => { setViewRecord(record); setView('view'); };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await api.delete(`/personnel-info/${id}`);
      message.success('លុបបានជោគជ័យ!');
      fetchRecords();
    } catch { message.error('មានបញ្ហា!'); }
  };

  // ── Download ───────────────────────────────────────────────────────────────
  const handleDownload = async (record, type) => {
    try {
      const ext = type === 'pdf' ? 'pdf' : 'xlsx';
      await downloadFile(`/personnel-info/${record.id}/export/${type}`, `personnel-${record.id_number}.${ext}`);
    } catch { message.error('មានបញ្ហា!'); }
  };

  // ── Validate ───────────────────────────────────────────────────────────────
  const validateForm = () => {
    const errs = {};
    if (!basic.name)          errs.name = true;
    if (!basic.id_number)     errs.id_number = true;
    if (!basic.date_of_birth) errs.date_of_birth = true;
    if (!birthLoc[0])   errs.birth_commune = true;
    if (!birthLoc[1])   errs.birth_district = true;
    if (!birthLoc[2])   errs.birth_province = true;
    if (!currentLoc[0]) errs.current_commune = true;
    if (!currentLoc[1]) errs.current_district = true;
    if (!currentLoc[2]) errs.current_province = true;
    return errs;
  };

  // ── Save All ───────────────────────────────────────────────────────────────
  const saveAll = async () => {
    const errs = validateForm();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      message.error('សូមបំពេញព័ត៌មានដែលត្រូវការទាំងអស់ដែលមានសញ្ញា *');
      return;
    }
    setSaving(true);
    try {
      // Step 1: Basic + photo
      const fd = new FormData();
      fd.append('name_kh',       basic.name_kh);
      fd.append('name',          basic.name);
      fd.append('gender',        basic.gender);
      fd.append('id_number',     basic.id_number);
      if (basic.date_of_birth) fd.append('date_of_birth', basic.date_of_birth);
      if (basic.military_id)   fd.append('military_id',   basic.military_id);
      if (basic.civilian_id)   fd.append('civilian_id',   basic.civilian_id);
      if (basic.phone_number)  fd.append('phone_number',  basic.phone_number);
      fd.append('birth_commune',    birthLoc[0]);
      fd.append('birth_district',   birthLoc[1]);
      fd.append('birth_province',   birthLoc[2]);
      fd.append('current_commune',  currentLoc[0]);
      fd.append('current_district', currentLoc[1]);
      fd.append('current_province', currentLoc[2]);
      const photoFile = fileList.find(f => f.originFileObj);
      if (photoFile) {
        fd.append('photo', photoFile.originFileObj);
      } else if (editRecord?.photo && fileList.length === 0) {
        fd.append('remove_photo', '1');
      }

      let pid = editRecord?.id ?? null;
      if (editRecord?.id) {
        await apiFormData(`/personnel-info/${editRecord.id}`, 'POST', fd);
      } else {
        const res = await apiFormData('/personnel-info', 'POST', fd);
        pid = res.data.id;
      }

      // Step 2: Military
      if (pid) {
        const mp = {
          personal_info_id:          pid,
          military_enlistment_date:  military.military_enlistment_date  || null,
          military_rank:             military.military_rank             || null,
          last_date_military_rank:   military.last_date_military_rank   || null,
          position:                  military.position                  || null,
          military_specialty:        military.military_specialty         || null,
          unit:                      military.unit                      || null,
          military_unit:             military.military_unit              || null,
          education_level:           military.education_level            || null,
          last_position:             military.last_position              || null,
        };
        const existMilId = editRecord?.military_info?.id;
        if (existMilId) await api.put(`/military-info/${existMilId}`, mp);
        else await api.post('/military-info', mp);
      }

      // Step 3: Family
      if (pid) {
        const fp = {
          personal_info_id:             pid,
          marital_status:               marital,
          spouse_name:                  spouse.spouse_name                 || null,
          spouse_type:                  spouse.spouse_type,
          spouse_gender:                spouse.spouse_gender               || null,
          spouse_dob:                   spouse.spouse_dob                  || null,
          spouse_birth_commune:         spouseBirth[0]                     || null,
          spouse_birth_district:        spouseBirth[1]                     || null,
          spouse_birth_province:        spouseBirth[2]                     || null,
          spouse_current_commune:       spouseCurrent[0]                   || null,
          spouse_current_district:      spouseCurrent[1]                   || null,
          spouse_current_province:      spouseCurrent[2]                   || null,
          marriage_certificate_number:  spouse.marriage_certificate_number || null,
          marriage_certificate_date:    spouse.marriage_certificate_date   || null,
          number_of_children:           numChildren.total,
          male_children_count:          numChildren.male,
          female_children_count:        numChildren.female,
        };
        const existFamId = editRecord?.family_info?.id;
        if (existFamId) await api.put(`/family-info/${existFamId}`, fp);
        else await api.post('/family-info', fp);
      }

      // Step 4: Children
      if (pid) {
        const originalIds = (editRecord?.family_info?.children || []).map(c => c.id);
        const currentIds  = children.filter(c => c.id).map(c => c.id);
        const removedIds  = originalIds.filter(id => !currentIds.includes(id));

        for (const child of children) {
          const payload = { name: child.name || null, date_of_birth: child.dob || null, personal_info_id: pid };
          if (child.id) await api.put(`/children/${child.id}`, payload);
          else          await api.post('/children', payload);
        }
        for (const id of removedIds) {
          await api.delete(`/children/${id}`);
        }
      }

      message.success('រក្សាទុកបានជោគជ័យ!');
      fetchRecords();
      setView('list');
    } catch (err) {
      const errors = err?.response?.data?.errors;
      if (errors) Object.values(errors).flat().forEach(m => message.error(m));
      else message.error('មានបញ្ហា សូមព្យាយាម!');
    } finally {
      setSaving(false);
    }
  };

  // ── Children ───────────────────────────────────────────────────────────────
  const addChild    = () => setChildren(p => [...p, { id: null, name: '', dob: '' }]);
  const updateChild = (idx, field, val) => setChildren(p => p.map((c, i) => i === idx ? { ...c, [field]: val } : c));
  const removeChild = (idx) => setChildren(p => p.filter((_, i) => i !== idx));

  // ── Table columns ──────────────────────────────────────────────────────────
  const columns = [
    { title: t('tb_no'),       key:'no',           width:50,  align:'center', onHeaderCell:()=>th(), render:(_,__,i)=>i+1 },
    { title: t('tb_id_number'),  dataIndex:'id_number', key:'id_number', align:'center', onHeaderCell:()=>th(), render:v=><Tag color="blue" style={{borderRadius:10}}>{v||'—'}</Tag> },
    { title: t('tb_name_kh'), dataIndex:'name_kh',  key:'name_kh',  onHeaderCell:()=>th({textAlign:'left'}), render:(v,r)=><Text strong>{v||r.name||'—'}</Text> },
    { title: t('tb_name'), dataIndex:'name',      key:'name',     onHeaderCell:()=>th({textAlign:'left'}) },
    { title: t('tb_gender'),  dataIndex:'gender',    key:'gender',   align:'center', onHeaderCell:()=>th(), render:v=>v==='male'?'ប្រុស':v==='female'?'ស្រី':'—' },
    { title: t('tb_phone'),  dataIndex:'phone_number', key:'phone_number', onHeaderCell:()=>th({textAlign:'left'}), render:v=>v||'—' },
    { title: t('tb_military_rank'),  key:'rank', onHeaderCell:()=>th({textAlign:'left'}), render:(_,r)=>r.military_info?.military_rank||'—' },
    { title: t('tb_status'),  key:'status', align:'center', onHeaderCell:()=>th(), render:()=><Tag color="success" style={{borderRadius:10}}>សកម្ម</Tag> },
    {
      title: t('action'), key:'action', align:'center', width:260, onHeaderCell:()=>th(),
      render:(_,record)=>(
        <Space size={4}>
          <Button size="small" type="primary" icon={<EyeOutlined/>} style={{fontSize:11}} onClick={()=>openView(record)}>{t('view')}</Button>
          <Button size="small" icon={<EditOutlined/>} style={{background:'#fa8c16',color:'#fff',border:'none',fontSize:11}} onClick={()=>openEdit(record)}> {t('edit')} </Button>
          <Dropdown menu={{ items: [
            { key:'pdf', icon:<FilePdfOutlined/>, label:t('download_pdf'), onClick:()=>handleDownload(record,'pdf') },
            { key:'excel', icon:<FileExcelOutlined/>, label:t('download_excel'), onClick:()=>handleDownload(record,'excel') },
          ] }} trigger={['click']}>
            <Button size="small" icon={<DownloadOutlined/>} style={{fontSize:11}}>{t('download')}</Button>
          </Dropdown>
          <Popconfirm title="តើអ្នកចង់លុប?" okText="យល់ព្រម" cancelText="មិន" onConfirm={()=>handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined/>} style={{fontSize:11}}> {t('delete')} </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) return <WaveLoading minHeight={600} />;

  // ════════════════════════════════════════════════════════════════════════════
  // LIST VIEW
  // ════════════════════════════════════════════════════════════════════════════
  if (view === 'list') return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <Text style={{color:NAVY,fontWeight:700,fontSize:18}}>I. {t('general_info')} </Text>
        <Button type="primary" icon={<PlusOutlined/>} onClick={openAdd} style={{background:NAVY}}>{t('add_new')}</Button>
      </div>
      <Table columns={columns} dataSource={records} rowKey="id" loading={loading} size="small" bordered
        pagination={{pageSize:10,showSizeChanger:true,showTotal:total=>`${t('total')}: ${total} ${t('people')}`}}
        style={{borderRadius:8}}
        locale={{emptyText:'មិនទាន់មានទិន្នន័យ'}}
      />
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // FORM VIEW — Word-style table form
  // ════════════════════════════════════════════════════════════════════════════
  if (view === 'form') return (
    <div>
      {/* Top action bar */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10 }}>
        <Breadcrumb items={[
          {title:<span style={{cursor:'pointer',color:NAVY }} onClick={()=>setView('list')}> {t('general_info')} </span>},
          {title:<span style={{color:'#888' }}>{editRecord? t('edit'): t('add_new') }</span>},
        ]}/>
        <Space>
          <Button icon={<ArrowLeftOutlined/>} onClick={()=>setView('list')}>{t('back')}</Button>
          {/* <Button type="primary" icon={<SaveOutlined/>} loading={saving} onClick={saveAll}
            style={{background:NAVY,fontWeight:600,minWidth:190}}>
            {saving ? 'កំពុងរក្សាទុក...' : '💾 រក្សាទុកទាំងអស់'}
          </Button> */}
        </Space>
      </div>

      {/* ── SECTION I ── */}
      <div style={S.section}>
        <SecTitle>I. {t('general_info')}</SecTitle>
        <table style={S.tbl}>
          <tbody>
            {/* Row 1: Name + Gender + Photo */}
            <tr>
              <td style={S.lbl}>- {t('name_kh')} </td>
              <td style={S.td}>
                <TblInput
                  value={basic.name_kh}
                  onChange={v => setBasic(p => ({ ...p, name_kh: v }))}
                  placeholder="........................................."
                />
              </td>

              <td style={{ ...S.lbl, width:70 }}> {t('gender')}</td>
              <td style={{ ...S.td, width: 150 }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 14 }}>
                    <input
                      type="checkbox"
                      checked={basic.gender === 'male'}
                      onChange={() => setBasic(p => ({ ...p, gender: 'male' }))}
                    />
                    {t('male')}
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 14 }}>
                    <input
                      type="checkbox"
                      checked={basic.gender === 'female'}
                      onChange={() => setBasic(p => ({ ...p, gender: 'female' }))}
                    />
                    {t('female')}
                  </label>
                </div>
              </td>

              {/* rowSpan changed from 7 -> 5 */}
              <td
                style={{
                  ...S.td,
                  width: 90,
                  textAlign: 'center',
                  verticalAlign: 'middle'
                }}
                rowSpan={5}
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  beforeUpload={() => false}
                  onChange={({ fileList: fl }) => setFileList(fl)}
                  maxCount={1}
                  accept="image/*"
                >
                  {fileList.length === 0 && (
                    <div style={{ textAlign: 'center' }}>
                      <CameraOutlined style={{ fontSize: 20, color: '#aaa' }} />
                      <div style={{ fontSize: 10, color: '#aaa', marginTop: 3 }}>
                        3×4
                      </div>
                    </div>
                  )}
                </Upload>
              </td>
            </tr>

            {/* Row 2 */}
            <tr>
              <td style={S.lbl}>- {t('name')}</td>
              <td style={S.td}>
                <TblInput
                  value={basic.name}
                  onChange={v => setBasic(p => ({ ...p, name: v }))}
                  placeholder="........................................."
                  style={errors.name ? { border: '1px solid red' } : {}}
                />
              </td>

              <td style={{ ...S.lbl, width: 70 }}>{t('id_number')}</td>
              <td style={S.td}>
                <TblInput
                  value={basic.id_number}
                  onChange={v => setBasic(p => ({ ...p, id_number: v }))}
                  placeholder=".................."
                  style={errors.id_number ? { border: '1px solid red' } : {}}
                />
              </td>
            </tr>

            {/* Row 3 */}
            <tr>
              <td style={S.lbl}>- {t('date_of_birth')}</td>
              <td style={S.td} colSpan={3}>
                <TblDatePicker
                  value={basic.date_of_birth}
                  onChange={v => setBasic(p => ({ ...p, date_of_birth: v }))}
                  error={errors.date_of_birth}
                  style={{ width: 140 }}
                />
              </td>
            </tr>

            {/* Row 4: Military ID + Civilian ID */}
            <tr>
              <td style={S.lbl}>- {t('military_id')}</td>
              <td style={S.td} colSpan={3}>
                <TblInput
                  value={basic.military_id}
                  onChange={v => setBasic(p => ({ ...p, military_id: v }))}
                  placeholder=".................."
                />
              </td>
            </tr>
            {/* Row 5 */}
            <tr>
              <td style={{ ...S.lbl, width: 90 }}>- {t('civilian_id')}</td>
              <td style={S.td} colSpan={3}>
                <TblInput
                  value={basic.civilian_id}
                  onChange={v => setBasic(p => ({ ...p, civilian_id: v }))}
                  placeholder=".................."
                />
              </td>
            </tr>

            {/* Row 6: Birth Location */}
            <tr>
              <td style={S.lbl}>- {t('birth_location')} </td>
              <LocationTd
                vals={birthLoc}
                onChange={(i, v) =>
                  setBirthLoc(p => {
                    const n = [...p];
                    n[i] = v;
                    return n;
                  })
                }
                colSpan={5}
                errors={[errors.birth_commune, errors.birth_district, errors.birth_province]}
              />
            </tr>

            {/* Row 7: Current Location */}
            <tr>
              <td style={S.lbl}>- {t('current_location')}</td>
              <LocationTd
                vals={currentLoc}
                onChange={(i, v) =>
                  setCurrentLoc(p => {
                    const n = [...p];
                    n[i] = v;
                    return n;
                  })
                }
                colSpan={5}
                errors={[errors.current_commune, errors.current_district, errors.current_province]}
              />
            </tr>

            {/* Row 8 */}
            <tr>
              <td style={{ ...S.lbl, width: 70 }}>- {t('phone')} </td>
              <td style={S.td} colSpan={4}>
                <TblInput
                  value={basic.phone_number}
                  onChange={v => setBasic(p => ({ ...p, phone_number: v }))}
                  placeholder=".................."
                />
              </td>

            </tr>

            {/* ── SECTION II ── */}

            <tr>
              <td style={S.lbl}>- {t('enlistment_date')}</td>
              <td style={S.td} colSpan={5}><TblDatePicker
              value={military.military_enlistment_date}
              onChange={v=>setMilitary(p=>({...p,military_enlistment_date:v}))}
              style={{ width:140 }}/></td>
            </tr>


            <tr>
              <td style={S.lbl2}>- {t('military_rank')} </td>
              <td style={S.td} colSpan={5}><TblInput value={military.military_rank} onChange={v=>setMilitary(p=>({...p,military_rank:v}))} placeholder=".................." /></td>
            </tr>

            <tr>
              <td style={S.lbl2}>- {t('position')}</td>
              <td style={S.td} colSpan={5}><TblInput value={military.position} onChange={v=>setMilitary(p=>({...p,position:v}))} placeholder=".................." /></td>
            </tr>

            <tr>
              <td style={S.lbl2}>- {t('unit')}</td>
              <td style={S.td} colSpan={5}><TblInput value={military.unit} onChange={v=>setMilitary(p=>({...p,unit:v}))} placeholder=".................." /></td>
            </tr>

            <tr>
              <td style={S.lbl}>- {t('military_unit')}</td>
              <td style={S.td} colSpan={5}><TblInput value={military.military_unit} onChange={v=>setMilitary(p=>({...p,military_unit:v}))} placeholder=".................." /></td>
            </tr>

            <tr>
              <td style={S.lbl2}>- {t('education_level')}</td>
              <td style={S.td} colSpan={5}><TblInput value={military.education_level} onChange={v=>setMilitary(p=>({...p,education_level:v}))} placeholder=".................." /></td>
            </tr>

            <tr>
              <td style={S.lbl}>- {t('military_specialty')}</td>
              <td style={S.td} colSpan={5}><TblInput value={military.military_specialty} onChange={v=>setMilitary(p=>({...p,military_specialty:v}))} placeholder=".................." /></td>
            </tr>

            <tr>
              <td style={S.lbl}>- {t('last_rank_date')}</td>
              <td style={S.td} colSpan={5}><TblDatePicker
              value={military.last_date_military_rank}
              onChange={v=>setMilitary(p=>({...p,last_date_military_rank:v}))}
              style={{ width: 140 }}/></td>

            </tr>


            <tr>
              <td style={S.lbl}>- {t('last_position')}</td>
              <td style={S.td} colSpan={5}><TblInput value={military.last_position} onChange={v=>setMilitary(p=>({...p,last_position:v}))} placeholder=".................." /></td>
            </tr>

            {/* ── SECTION III ── */}
            {/* Marital status */}
            <tr>
              <td style={S.lbl}>- {t('marital_status')}</td>
              <td style={S.td} colSpan={5}>
                <div style={{ display: 'flex' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 16, cursor: 'pointer', width: '50%' }}>
                    <input type="checkbox" checked={!marital} onChange={() => setMarital(false)} />
                    {t('single')}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 16, cursor: 'pointer', width: '50%' }}>
                    <input type="checkbox" checked={marital} onChange={() => setMarital(true)} />
                    {t('married')}
                  </label>
                </div>
              </td>
            </tr>

            {/* Spouse rows — conditional */}
            {marital && (<>
              <tr>
                <td style={S.lbl}>- {t('spouse_name')}</td>
                <td style={S.td} colSpan={5}>
                  <div style={{ display: 'flex' }}>
                      <TblInput value={spouse.spouse_name} onChange={v=>setSpouse(p=>({...p,spouse_name:v}))} placeholder=".................." style={{ width: '50%' }} />
                      <div style={{display:'flex',gap:16,width:'50%',borderLeft:BORDER,paddingLeft:8}}>
                        <label style={{display:'flex',alignItems:'center',gap:3,fontSize:16,cursor:'pointer'}}>
                          <input type="checkbox" checked={!spouse.spouse_type} onChange={()=>setSpouse(p=>({...p,spouse_type:false}))} /> {t('husband')}
                        </label>
                        <label style={{display:'flex',alignItems:'center',gap:3,fontSize:16,cursor:'pointer'}}>
                          <input type="checkbox" checked={spouse.spouse_type} onChange={()=>setSpouse(p=>({...p,spouse_type:true}))} /> {t('wife')}
                        </label>
                      </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={S.lbl}>- {t('spouse_dob')} </td>
                <td style={S.td} colSpan={5}><TblDatePicker
                value={spouse.spouse_dob}
                onChange={v=>setSpouse(p=>({...p,spouse_dob:v}))}
                style={{ width:140 }}/></td>
              </tr>

            {/* check */}
              <tr>
                <td style={S.lbl}>- {t('birth_location')}</td>
                <LocationTd vals={spouseBirth} onChange={(i,v)=>setSpouseBirth(p=>{const n=[...p];n[i]=v;return n;})} colSpan={5} />
              </tr>
              <tr>
                <td style={S.lbl} >- {t('current_location')} </td>
                <LocationTd vals={spouseCurrent} onChange={(i,v)=>setSpouseCurrent(p=>{const n=[...p];n[i]=v;return n;})} colSpan={5} />
              </tr>

              <tr>
                <td style={S.lbl2}>- {t('marriage_cert_no')} </td>
                <td colSpan={5}>
                    <div style={{ display: 'flex' }}>
                      <div style={{paddingLeft:8, fontSize:16 , display:'flex', width:'100%'}}>
                          <span>លេខ ៖ </span>
                          <TblInput value={spouse.marriage_certificate_number} onChange={v=>setSpouse(p=>({...p,marriage_certificate_number:v}))} placeholder=".................." style={{ width: '50%' ,paddingLeft: 8}} />
                          <TblDatePicker value={spouse.marriage_certificate_date}
                          onChange={v=>setSpouse(p=>({...p,marriage_certificate_date:v}))}
                          style={{ width: 140, borderLeft: BORDER, paddingLeft: 8 }} />
                      </div>
                    </div>
                </td>
              </tr>

            </>)}

            {/* Children count */}
            <tr>
              <td style={S.lbl}>- {t('num_children')}</td>
              <td style={S.td} colSpan={5}>
                <div style={{display:'flex',gap:20,alignItems:'center'}}>
                  <span style={{fontSize:16}}>
                    {t('child_total')}
                    <input type="number" min={0} value={numChildren.total}
                      onChange={e=>setNumChildren(p=>({...p,total:+e.target.value}))}
                      style={{width:46,border:'none',borderBottom:'1px solid #aaa',outline:'none',fontSize:16,fontFamily:'inherit',background:'transparent'}} />
                  </span>
                  <span style={{fontSize:16}}>
                    {t('male_children')}
                    <input type="number" min={0} value={numChildren.male}
                      onChange={e=>setNumChildren(p=>({...p,male:+e.target.value}))}
                      style={{width:40,border:'none',borderBottom:'1px solid #aaa',outline:'none',fontSize:16,fontFamily:'inherit',background:'transparent'}} />
                  </span>
                  <span style={{fontSize:16}}>
                    {t('female_children')}
                    <input type="number" min={0} value={numChildren.female}
                      onChange={e=>setNumChildren(p=>({...p,female:+e.target.value}))}
                      style={{width:40,border:'none',borderBottom:'1px solid #aaa',outline:'none',fontSize:16, fontFamily:'inherit',background:'transparent'}} />
                  </span>
                </div>
              </td>
            </tr>

            {/* Children list */}
            <tr>
              <td style={{...S.lbl,verticalAlign:'top',paddingTop:8}}>- {t('child_name')} </td>
              <td style={S.td} colSpan={5}>
                {children.map((child, idx) => (
                  <div key={idx} style={{display:'flex',alignItems:'center',gap:8,marginBottom:5}}>
                    <div style={{width:'50%',display:'flex',alignItems:'center',gap:4}}>
                      <span style={{fontSize:16 ,color:'#666',minWidth:20}}>{formatNumberDisplay(idx+1, i18n.language)}.</span>
                      <input
                        value={child.name}
                        onChange={e=>updateChild(idx,'name',e.target.value)}
                        placeholder={t('child_name')}
                        style={{flex:1,border:'none',borderBottom:'1px solid #aaa',outline:'none',fontSize:16,fontFamily:'inherit',background:'transparent',padding:'1px 2px'}}
                      />
                    </div>

                    <div style={{width:'50%',display:'flex',alignItems:'center',gap:4}}>
                      <span>{t('child_dob')}</span>
                      <TblDatePicker
                        value={child.dob}
                        onChange={v=>updateChild(idx,'dob',v)}
                        style={{ width:130 }}
                      />
                      <button onClick={()=>removeChild(idx)}
                        style={{background:'none',border:'none',color:'#e00',cursor:'pointer',fontSize:16,padding:'0 2px',lineHeight:1}}>✕</button>
                    </div>
                  </div>
                ))}
                <button onClick={addChild}
                  style={{background:'none',border:'1px dashed #002366',color:NAVY,fontSize:12,padding:'3px 10px',borderRadius:4,cursor:'pointer',fontFamily:'inherit',marginTop:4}}>
                  + {t('add_new_child')}
                </button>
              </td>
            </tr>


          </tbody>
        </table>
      </div>


      {/* Bottom Save */}
      <div style={{display:'flex',justifyContent:'flex-end',gap:8,paddingBottom:24}}>
        <Button icon={<ArrowLeftOutlined/>} onClick={()=>setView('list')}> {t('back')} </Button>
        <Button type="primary"  loading={saving} onClick={saveAll}
          style={{background:NAVY,fontWeight:600,minWidth:200}}>
          {saving ? t('saving') : t('save_all')}
        </Button>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // VIEW DETAIL — read-only, full field set
  // ════════════════════════════════════════════════════════════════════════════
  if (view === 'view') return (
    <PersonalInfoDetail record={viewRecord} onBack={() => setView('list')} onEdit={openEdit} />
  );
}
