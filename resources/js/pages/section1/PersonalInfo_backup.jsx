import React, { useEffect, useState } from 'react';
import {
  Form, Input, Select, DatePicker, Button, Row, Col, Card, Tabs,
  Upload, message, Divider, Space, InputNumber, Flex, Typography,
} from 'antd';
import { PlusOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import api, { apiFormData } from '../../api/axios';
import useAuthStore from '../../store/authStore';

const { Title, Text } = Typography;
const NAVY_BLUE = '#002366';

const SectionHeader = ({ title }) => (
  <div style={{
    background: NAVY_BLUE, color: 'white', padding: '8px 16px',
    borderRadius: 4, marginBottom: 16, fontWeight: 600, fontSize: 14,
  }}>
    {title}
  </div>
);

const LocationFields = ({ prefix, label, t }) => (
  <>
    <Divider orientation="left" style={{ color: NAVY_BLUE, fontSize: 13 }}>{label}</Divider>
    <Row gutter={12}>
      <Col xs={24} sm={8}>
        <Form.Item name={`${prefix}_village`} label={t('section1.village')}>
          <Input variant="filled" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={8}>
        <Form.Item name={`${prefix}_district`} label={t('section1.district')}>
          <Input variant="filled" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={8}>
        <Form.Item name={`${prefix}_province`} label={t('section1.province')}>
          <Input variant="filled" />
        </Form.Item>
      </Col>
    </Row>
  </>
);

const PersonalInfo = () => {
  const { t } = useTranslation();
  const { setPersonalInfoId, personalInfoId } = useAuthStore();
  const [basicForm] = Form.useForm();
  const [militaryForm] = Form.useForm();
  const [familyForm] = Form.useForm();
  const [loading, setLoading] = useState({ basic: false, military: false, family: false });
  const [fileList, setFileList] = useState([]);
  const [personalInfo, setPersonalInfo] = useState(null);
  const [militaryInfo, setMilitaryInfo] = useState(null);
  const [familyInfo, setFamilyInfo] = useState(null);
  const [maritalStatus, setMaritalStatus] = useState(false);
  const [children, setChildren] = useState([]);

  const fetchData = async () => {
    try {
      const res = await api.get('/personnel-info');
      if (res.data) {
        const info = res.data;
        setPersonalInfo(info);
        setPersonalInfoId(info.id);
        basicForm.setFieldsValue({
          ...info,
          date_of_birth: info.date_of_birth ? dayjs(info.date_of_birth) : null,
        });
        if (info.photo) {
          setFileList([{
            uid: '-1',
            name: 'photo',
            status: 'done',
            url: `/storage/${info.photo}`,
          }]);
        }

        if (info.military_info) {
          const mi = info.military_info;
          setMilitaryInfo(mi);
          militaryForm.setFieldsValue({
            ...mi,
            military_enlistment_date: mi.military_enlistment_date ? dayjs(mi.military_enlistment_date) : null,
            last_date_military_rank: mi.last_date_military_rank ? dayjs(mi.last_date_military_rank) : null,
          });
        }

        if (info.family_info) {
          const fi = info.family_info;
          setFamilyInfo(fi);
          setMaritalStatus(!!fi.marital_status);
          setChildren(fi.children || []);
          familyForm.setFieldsValue({
            ...fi,
            spouse_dob: fi.spouse_dob ? dayjs(fi.spouse_dob) : null,
            marriage_certificate_date: fi.marriage_certificate_date ? dayjs(fi.marriage_certificate_date) : null,
          });
        }
      }
    } catch {
      // no existing record
    }
  };

  useEffect(() => { fetchData(); }, []);

  const saveBasicInfo = async () => {
    const values = await basicForm.validateFields();
    setLoading((p) => ({ ...p, basic: true }));
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === 'photo') return;
        const val = values[key];
        if (val === null || val === undefined) return;
        if (val?.format) {
          formData.append(key, val.format('YYYY-MM-DD'));
        } else {
          formData.append(key, val);
        }
      });
      const file = fileList.find((f) => f.originFileObj);
      if (file) formData.append('photo', file.originFileObj);

      let res;
      if (personalInfo?.id) {
        formData.append('_method', 'PUT');
        res = await apiFormData(`/personnel-info/${personalInfo.id}`, 'POST', formData);
      } else {
        res = await apiFormData('/personnel-info', 'POST', formData);
      }
      setPersonalInfo(res.data);
      setPersonalInfoId(res.data.id);
      message.success(t('common.success'));
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) Object.values(data.errors).flat().forEach((m) => message.error(m));
      else message.error(t('common.error'));
    } finally {
      setLoading((p) => ({ ...p, basic: false }));
    }
  };

  const saveMilitaryInfo = async () => {
    if (!personalInfo?.id) {
      message.warning('Please save Basic Information first.');
      return;
    }
    const values = await militaryForm.validateFields();
    setLoading((p) => ({ ...p, military: true }));
    try {
      const payload = {
        ...values,
        personal_info_id: personalInfo.id,
        military_enlistment_date: values.military_enlistment_date?.format('YYYY-MM-DD') || null,
        last_date_military_rank: values.last_date_military_rank?.format('YYYY-MM-DD') || null,
      };
      if (militaryInfo?.id) {
        await api.put(`/military-info/${militaryInfo.id}`, payload);
      } else {
        const res = await api.post('/military-info', payload);
        setMilitaryInfo(res.data);
      }
      message.success(t('common.success'));
    } catch (err) {
      message.error(t('common.error'));
    } finally {
      setLoading((p) => ({ ...p, military: false }));
    }
  };

  const saveFamilyInfo = async () => {
    if (!personalInfo?.id) {
      message.warning('Please save Basic Information first.');
      return;
    }
    const values = await familyForm.validateFields();
    setLoading((p) => ({ ...p, family: true }));
    try {
      const payload = {
        ...values,
        personal_info_id: personalInfo.id,
        spouse_dob: values.spouse_dob?.format('YYYY-MM-DD') || null,
        marriage_certificate_date: values.marriage_certificate_date?.format('YYYY-MM-DD') || null,
      };
      if (familyInfo?.id) {
        await api.put(`/family-info/${familyInfo.id}`, payload);
      } else {
        const res = await api.post('/family-info', payload);
        setFamilyInfo(res.data);
      }
      message.success(t('common.success'));
    } catch (err) {
      message.error(t('common.error'));
    } finally {
      setLoading((p) => ({ ...p, family: false }));
    }
  };

  const addChild = async () => {
    if (!familyInfo?.id) {
      message.warning('Please save Family Information first.');
      return;
    }
    try {
      const res = await api.post('/children', { family_info_id: familyInfo.id, name: '', date_of_birth: null, gender: null });
      setChildren((prev) => [...prev, res.data]);
    } catch {
      message.error(t('common.error'));
    }
  };

  const updateChild = async (idx, field, val) => {
    const child = children[idx];
    setChildren((prev) => prev.map((c, i) => (i === idx ? { ...c, [field]: val } : c)));
    if (!child?.id) return;
    try {
      await api.put(`/children/${child.id}`, { [field]: val });
    } catch {
      message.error(t('common.error'));
    }
  };

  const removeChild = async (idx) => {
    const child = children[idx];
    try {
      if (child?.id) await api.delete(`/children/${child.id}`);
      setChildren((prev) => prev.filter((_, i) => i !== idx));
    } catch {
      message.error(t('common.error'));
    }
  };

  const tabItems = [
    {
      key: 'basic',
      label: t('section1.basic_info'),
      children: (
        <Form form={basicForm} layout="vertical">
          <SectionHeader title={t('section1.title')} />
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="name_kh" label={t('section1.nam_kh')}>
                <Input variant="filled" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="name" label={t('section1.name')}>
                <Input variant="filled" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="gender" label={t('section1.gender')}>
                <Select>
                  <Select.Option value="male">{t('section1.male')}</Select.Option>
                  <Select.Option value="female">{t('section1.female')}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="id_number" label={t('section1.id_number')}>
                <Input variant="filled" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="date_of_birth" label={t('section1.date_of_birth')}>
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="military_id" label={t('section1.military_id')}>
                <Input variant="filled" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="civilian_id" label={t('section1.civilian_id')}>
                <Input variant="filled" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="phone_number" label={t('section1.phone')}>
                <Input variant="filled" />
              </Form.Item>
            </Col>
          </Row>

          <LocationFields prefix="birth" label={t('section1.birth_location')} t={t} />
          <LocationFields prefix="current" label={t('section1.current_location')} t={t} />

          <Divider orientation="left" style={{ color: NAVY_BLUE, fontSize: 13 }}>{t('section1.photo')}</Divider>
          <Form.Item name="photo">
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList: fl }) => setFileList(fl)}
              maxCount={1}
              accept="image/*"
            >
              {fileList.length === 0 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>{t('section1.upload_photo')}</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Flex justify="flex-end">
            <Button
              type="primary" icon={<SaveOutlined />}
              loading={loading.basic} onClick={saveBasicInfo}
              style={{ background: NAVY_BLUE, minWidth: 140 }}
            >
              {t('section1.save')}
            </Button>
          </Flex>
        </Form>
      ),
    },
    {
      key: 'military',
      label: t('section1.military_info'),
      children: (
        <Form form={militaryForm} layout="vertical">
          <SectionHeader title={t('section1.military_info')} />
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item name="military_enlistment_date" label={t('section1.enlistment_date')}>
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="military_rank" label={t('section1.military_rank')}>
                <Input variant="filled" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="position" label={t('section1.position')}>
                <Input variant="filled" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="unit" label={t('section1.unit')}>
                <Input variant="filled" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="military_unit" label={t('section1.military_unit')}>
                <Input variant="filled" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="education_level" label={t('section1.education_level')}>
                <Input variant="filled" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="military_specialty" label={t('section1.military_specialty')}>
                <Input variant="filled" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="last_date_military_rank" label={t('section1.last_rank_date')}>
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="last_position" label={t('section1.last_position')}>
                <Input variant="filled" />
              </Form.Item>
            </Col>
          </Row>
          <Flex justify="flex-end">
            <Button
              type="primary" icon={<SaveOutlined />}
              loading={loading.military} onClick={saveMilitaryInfo}
              style={{ background: NAVY_BLUE, minWidth: 140 }}
            >
              {t('section1.save')}
            </Button>
          </Flex>
        </Form>
      ),
    },
    {
      key: 'family',
      label: t('section1.family_info'),
      children: (
        <Form form={familyForm} layout="vertical">
          <SectionHeader title={t('section1.family_info')} />
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item name="marital_status" label={t('section1.marital_status')}>
                <Select onChange={setMaritalStatus}>
                  <Select.Option value={false}>{t('section1.single')}</Select.Option>
                  <Select.Option value={true}>{t('section1.married')}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {maritalStatus === true && (
            <>
              <Divider orientation="left" style={{ color: NAVY_BLUE, fontSize: 13 }}>
                {t('section1.spouse_name')}
              </Divider>
              <Row gutter={16}>
                <Col xs={24} sm={8}>
                  <Form.Item name="spouse_name" label={t('section1.spouse_name')}>
                    <Input variant="filled" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name="spouse_type" label={t('section1.spouse_type')}>
                    <Select>
                      <Select.Option value={false}>{t('section1.husband')}</Select.Option>
                      <Select.Option value={true}>{t('section1.wife')}</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name="spouse_gender" label={t('section1.spouse_gender')}>
                    <Select>
                      <Select.Option value="male">{t('section1.male')}</Select.Option>
                      <Select.Option value="female">{t('section1.female')}</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name="spouse_dob" label={t('section1.spouse_dob')}>
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name="marriage_certificate_number" label={t('section1.marriage_cert_no')}>
                    <Input variant="filled" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name="marriage_certificate_date" label={t('section1.marriage_cert_date')}>
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
              </Row>
              <LocationFields prefix="spouse_birth" label={t('section1.spouse_birth_location')} t={t} />
              <LocationFields prefix="spouse_current" label={t('section1.spouse_current_location')} t={t} />
            </>
          )}

          <Divider orientation="left" style={{ color: NAVY_BLUE, fontSize: 13 }}>
            {t('section1.children_list')}
          </Divider>
          <Row gutter={16} style={{ marginBottom: 8 }}>
            <Col xs={24} sm={8}>
              <Form.Item name="number_of_children" label={t('section1.num_children')}>
                <InputNumber min={0} style={{ width: '100%' }} variant="filled" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="male_children_count" label={t('section1.male_children')}>
                <InputNumber min={0} style={{ width: '100%' }} variant="filled" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="female_children_count" label={t('section1.female_children')}>
                <InputNumber min={0} style={{ width: '100%' }} variant="filled" />
              </Form.Item>
            </Col>
          </Row>

          {children.map((child, idx) => (
            <Row gutter={12} key={child.id || idx} align="middle" style={{ marginBottom: 8 }}>
              <Col xs={24} sm={10}>
                <Input
                  placeholder={t('section1.child_name')}
                  value={child.name || ''}
                  variant="filled"
                  onChange={(e) => updateChild(idx, 'name', e.target.value)}
                />
              </Col>
              <Col xs={24} sm={10}>
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  placeholder={t('section1.child_dob')}
                  value={child.date_of_birth ? dayjs(child.date_of_birth) : null}
                  onChange={(date) => updateChild(idx, 'date_of_birth', date ? date.format('YYYY-MM-DD') : null)}
                />
              </Col>
              <Col xs={24} sm={4}>
                <Button danger icon={<DeleteOutlined />} onClick={() => removeChild(idx)} />
              </Col>
            </Row>
          ))}

          <Button
            icon={<PlusOutlined />} type="dashed" onClick={addChild}
            style={{ marginBottom: 16, color: NAVY_BLUE, borderColor: NAVY_BLUE }}
          >
            {t('section1.add_child')}
          </Button>

          <Flex justify="flex-end">
            <Button
              type="primary" icon={<SaveOutlined />}
              loading={loading.family} onClick={saveFamilyInfo}
              style={{ background: NAVY_BLUE, minWidth: 140 }}
            >
              {t('section1.save')}
            </Button>
          </Flex>
        </Form>
      ),
    },
  ];

  return (
    <div>
      <Tabs
        defaultActiveKey="basic"
        items={tabItems}
        type="card"
        tabBarStyle={{ marginBottom: 0 }}
      />
    </div>
  );
};

export default PersonalInfo;
