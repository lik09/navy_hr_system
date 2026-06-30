import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Button, Typography, Space } from 'antd';
import {
  IdcardOutlined, BankOutlined, BookOutlined,
  TrophyOutlined, AimOutlined, HeartOutlined, RightOutlined,
  ClusterOutlined,
} from '@ant-design/icons';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import WaveLoading from '../../components/ui/WaveLoading';

const { Title, Text } = Typography;
const NAVY_BLUE = '#002366';

// ✅ Fix — handle array, paginated, និង grouped response
const countRecords = (data) => {
  if (!data) return 0;
  if (Array.isArray(data)) return data.length;
  if (Array.isArray(data.data)) return data.data.length;
  if (data.data && Array.isArray(data.data.data)) return data.data.data.length;
  return 0;
};

export default function Dashboard() {
  const { t ,i18n } = useTranslation();
  
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [personnel, setPersonnel] = useState([]);
  const [counts, setCounts] = useState({
    military: 0,
    education: 0,
    training: 0,
    mission: 0,
    health: 0,
    unit: 0,
  });


  useEffect(() => {
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, milRes, eduRes, trainRes, missRes, healthRes, unitRes] = await Promise.all([
        api.get('/personnel-info'),
        api.get('/military-service-histories'),
        api.get('/education'),
        api.get('/specialized-trainings'),
        api.get('/missions'),
        api.get('/health'),
        api.get('/unit'),
      ]);

      setPersonnel(
        Array.isArray(pRes.data) ? pRes.data :
        Array.isArray(pRes.data?.data) ? pRes.data.data :
        pRes.data?.data?.data || []
      );

      setCounts({
        military : countRecords(milRes.data),
        education: countRecords(eduRes.data),
        training : countRecords(trainRes.data),
        mission  : countRecords(missRes.data),
        health   : countRecords(healthRes.data),
        unit     : countRecords(unitRes.data),
      });

    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

    fetchAll();
  }, [user?.id]);

  const totalPersonnel = personnel.length;
  const maleCount     = personnel.filter((p) => p.gender === 'male').length;
  const femaleCount   = personnel.filter((p) => p.gender === 'female').length;
  const malePct   = totalPersonnel ? Math.round((maleCount   / totalPersonnel) * 100) : 0;
  const femalePct = totalPersonnel ? Math.round((femaleCount / totalPersonnel) * 100) : 0;

  const recentPersonnel = personnel.slice(0, 5);

  const statTiles = [
    { key: 'total_military',   icon: <IdcardOutlined />, value: totalPersonnel,  color: NAVY_BLUE,  path: '/personal-info' },
    { key: 'military_service', icon: <BankOutlined />,   value: counts.military, color: '#1677ff',  path: '/military-service' },
    { key: 'education',        icon: <BookOutlined />,   value: counts.education,color: '#13a8a8',  path: '/education' },
    { key: 'training',         icon: <TrophyOutlined />, value: counts.training, color: '#d48806',  path: '/training' },
    { key: 'mission',          icon: <AimOutlined />,    value: counts.mission,  color: '#cf1322',  path: '/mission' },
    { key: 'health',           icon: <HeartOutlined />,  value: counts.health,   color: '#c41d7f',  path: '/health' },
    { key: 'total_unit',       icon: <ClusterOutlined />,value: counts.unit,     color: '#722ed1',  path: '/setup/unit' },
  ];

  const genderData = [
    { name: t('male'),   value: maleCount,   color: '#1677ff' },
    { name: t('female'), value: femaleCount, color: '#c41d7f' },
  ];

  const sectionData = statTiles.map((tile) => ({
    name: t(tile.key),
    value: tile.value,
    color: tile.color,
  }));

  const quickLinks = [
    { icon: <IdcardOutlined />, labelKey: 'general_info',     path: '/personal-info' },
    { icon: <BankOutlined />,   labelKey: 'military_service', path: '/military-service' },
    { icon: <BookOutlined />,   labelKey: 'education',        path: '/education' },
    { icon: <TrophyOutlined />, labelKey: 'training',         path: '/training' },
    { icon: <AimOutlined />,    labelKey: 'mission',          path: '/mission' },
    { icon: <HeartOutlined />,  labelKey: 'health',           path: '/health' },
  ];

  const recentColumns = [
    { title: t('tb_no'),           render: (_, __, i) => i + 1, width: 50, align: 'center' },
    { title: t('name_kh'),        
      render: (_, r) => {
        return (i18n.language === 'km' ? r.name_kh : r.name) || r.name_kh || r.name || '—';
      }, },
    { title: t('tb_id_number'),    dataIndex: 'id_number' },
    { title: t('tb_military_rank'), 
      render: (_, r) => {
        const rank = r.military_info?.military_rank;
        return (i18n.language === 'km' ? rank?.name_kh : rank?.name) || rank?.name_kh || rank?.name || '—';
      },
    },
    { title: t('tb_phone'),        dataIndex: 'phone_number', render: (v) => v || '—' },
  ];

  if (loading) return <WaveLoading minHeight={600} />;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ color: NAVY_BLUE, margin: 0 }}>
          {t('dashboard')}
        </Title>
        <Text type="secondary">
          {t('welcome', { name: user?.name || user?.username || '' })}
        </Text>
      </div>

      {/* STAT TILES */}
      {/* <Row gutter={[16, 16]}>
        {statTiles.map((tile) => (
          <Col xs={24} sm={12} md={8} lg={4} key={tile.key}>
            <Card
              hoverable
              onClick={() => navigate(tile.path)}
              styles={{ body: { padding: 16 } }}
            >
              <Statistic
                title={t(tile.key)}
                value={tile.value}
                prefix={
                  <span style={{ color: tile.color, marginRight: 6 }}>
                    {tile.icon}
                  </span>
                }
                valueStyle={{ color: tile.color, fontWeight: 700 }}
              />
            </Card>
          </Col>
        ))}
      </Row> */}

      {/* SECTION OVERVIEW BAR CHART */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title={t('section_overview')}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={sectionData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }} barCategoryGap="15%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={48}>
                  {sectionData.map((entry, index) => (
                    <Cell key={`section-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* RECENT PERSONNEL */}
        <Col xs={24} lg={16}>
          <Card
            title={t('recent_military')}
            extra={
              <Button type="link" onClick={() => navigate('/personal-info')}>
                {t('view_all')} <RightOutlined />
              </Button>
            }
          >
            <Table
              dataSource={recentPersonnel}
              columns={recentColumns}
              rowKey="id"
              size="small"
              pagination={false}
              locale={{ emptyText: t('no_data') }}
            />
          </Card>
        </Col>

        {/* GENDER + QUICK LINKS */}
        <Col xs={24} lg={8}>
          <Card title={t('gender_distribution')} style={{ marginBottom: 16 }}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={genderData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`gender-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <Space style={{ width: '100%', justifyContent: 'center' }}>
              <Text type="secondary">{t('male')}: {malePct}%</Text>
              <Text type="secondary">{t('female')}: {femalePct}%</Text>
            </Space>
          </Card>

          {/* <Card title={t('quick_links')}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {quickLinks.map((link) => (
                <Button
                  key={link.path}
                  block
                  icon={link.icon}
                  onClick={() => navigate(link.path)}
                  style={{ textAlign: 'left', color: NAVY_BLUE, borderColor: '#d9d9d9' }}
                >
                  {t(link.labelKey)}
                </Button>
              ))}
            </Space>
          </Card> */}
        </Col>
      </Row>
    </div>
  );
}