// resources/js/components/section1/PersonalInfoDetail.jsx
import { Breadcrumb, Button, Space, Tag, Typography } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { formatDateDisplay, formatNumberDisplay } from '../../utils/khmerNumerals';
import { NAVY, S, SecTitle } from './personalInfoStyles';

const { Text } = Typography;

// ── Detail view (read-only) ───────────────────────────────────────────────────
const PersonalInfoDetail = ({ record, onBack, onEdit }) => {
  const { t, i18n } = useTranslation();
  const r = record;
  const mi = r?.military_info;
  const fi = r?.family_info;

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
        <Breadcrumb items={[
          {title:<span style={{cursor:'pointer',color:NAVY}} onClick={onBack}> {t('general_info')} </span>},
          {title:<span style={{color:'#888'}}> {t('detail_info')} </span>},
        ]}/>
        <Space>
          <Button icon={<ArrowLeftOutlined/>} onClick={onBack}> {t('back')} </Button>
          <Button icon={<EditOutlined/>} style={{background:'#fa8c16',color:'#fff',border:'none'}} onClick={()=>onEdit(r)}>{t('edit')}</Button>
        </Space>
      </div>

      {/* ── SECTION I ── */}
      <div style={S.section}>
        <SecTitle>I. {t('general_info')}</SecTitle>
        <table style={S.tbl}>
          <tbody>
            <tr>
              <td style={S.lbl}>- {t('name_kh')} </td>
              <td style={S.td}><Text strong>{r?.name_kh||'—'}</Text></td>

              <td style={{ ...S.lbl, width:70 }}> {t('gender')}</td>
              <td style={{ ...S.td, width: 150 }}>{r?.gender==='male'?t('male'):r?.gender==='female'?t('female'):'—'}</td>

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
                {r?.photo
                  ? <img src={`/storage/${r.photo}`} alt="photo" style={{width:76,height:96,objectFit:'cover',borderRadius:4,border:'1px solid #ddd'}} />
                  : <div style={{width:76,height:96,background:'#e8f0fe',borderRadius:4,border:'1px solid #ddd',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,margin:'0 auto'}}>👤</div>
                }
              </td>
            </tr>

            {/* Row 2 */}
            <tr>
              <td style={S.lbl}>- {t('name')}</td>
              <td style={S.td}>{r?.name||'—'}</td>

              <td style={{ ...S.lbl, width: 70 }}>{t('id_number')}</td>
              <td style={S.td}><Tag color="blue" style={{borderRadius:10}}>{r?.id_number||'—'}</Tag></td>
            </tr>

            {/* Row 3 */}
            <tr>
              <td style={S.lbl}>- {t('date_of_birth')}</td>
              <td style={S.td} colSpan={3}>{formatDateDisplay(r?.date_of_birth, i18n.language)}</td>
            </tr>

            {/* Row 4: Military ID + Civilian ID */}
            <tr>
              <td style={S.lbl}>- {t('military_id')}</td>
              <td style={S.td} colSpan={3}>{r?.military_id||'—'}</td>
            </tr>
            {/* Row 5 */}
            <tr>
              <td style={{ ...S.lbl, width: 90 }}>- {t('civilian_id')}</td>
              <td style={S.td} colSpan={3}>{r?.civilian_id||'—'}</td>
            </tr>

            {/* Row 6: Birth Location */}
            <tr>
              <td style={S.lbl}>- {t('birth_location')} </td>
              <td style={S.td} colSpan={5}>{[r?.birth_commune,r?.birth_district,r?.birth_province].filter(Boolean).join(' / ')||'—'}</td>
            </tr>

            {/* Row 7: Current Location */}
            <tr>
              <td style={S.lbl}>- {t('current_location')}</td>
              <td style={S.td} colSpan={5}>{[r?.current_commune,r?.current_district,r?.current_province].filter(Boolean).join(' / ')||'—'}</td>
            </tr>

            {/* Row 8 */}
            <tr>
              <td style={{ ...S.lbl, width: 70 }}>- {t('phone')} </td>
              <td style={S.td} colSpan={4}>{r?.phone_number||'—'}</td>
            </tr>

            {/* ── SECTION II ── */}

            <tr>
              <td style={S.lbl}>- {t('enlistment_date')}</td>
              <td style={S.td} colSpan={5}>{formatDateDisplay(mi?.military_enlistment_date, i18n.language)}</td>
            </tr>

            <tr>
              <td style={S.lbl2}>- {t('military_rank')} </td>
              <td style={S.td} colSpan={5}><Tag color="geekblue">{mi?.military_rank||'—'}</Tag></td>
            </tr>

            <tr>
              <td style={S.lbl2}>- {t('position')}</td>
              <td style={S.td} colSpan={5}>{mi?.position||'—'}</td>
            </tr>

            <tr>
              <td style={S.lbl2}>- {t('unit')}</td>
              <td style={S.td} colSpan={5}>{mi?.unit||'—'}</td>
            </tr>

            <tr>
              <td style={S.lbl}>- {t('military_unit')}</td>
              <td style={S.td} colSpan={5}>{mi?.military_unit||'—'}</td>
            </tr>

            <tr>
              <td style={S.lbl2}>- {t('education_level')}</td>
              <td style={S.td} colSpan={5}>{mi?.education_level||'—'}</td>
            </tr>

            <tr>
              <td style={S.lbl}>- {t('military_specialty')}</td>
              <td style={S.td} colSpan={5}>{mi?.military_specialty||'—'}</td>
            </tr>

            <tr>
              <td style={S.lbl}>- {t('last_rank_date')}</td>
              <td style={S.td} colSpan={5}>{formatDateDisplay(mi?.last_date_military_rank, i18n.language)}</td>
            </tr>

            <tr>
              <td style={S.lbl}>- {t('last_position')}</td>
              <td style={S.td} colSpan={5}>{mi?.last_position||'—'}</td>
            </tr>

            {/* ── SECTION III ── */}
            {/* Marital status */}
            <tr>
              <td style={S.lbl}>- {t('marital_status')}</td>
              <td style={S.td} colSpan={5}>{fi?.marital_status ? t('married') : t('single')}</td>
            </tr>

            {/* Spouse rows — conditional */}
            {fi?.marital_status && (<>
              <tr>
                <td style={S.lbl}>- {t('spouse_name')}</td>
                <td style={S.td} colSpan={5}>
                  <Text strong>{fi?.spouse_name||'—'}</Text>
                  {' '}({fi?.spouse_type ? t('wife') : t('husband')})
                </td>
              </tr>
              <tr>
                <td style={S.lbl}>- {t('spouse_dob')} </td>
                <td style={S.td} colSpan={5}>{formatDateDisplay(fi?.spouse_dob, i18n.language)}</td>
              </tr>
              <tr>
                <td style={S.lbl}>- {t('birth_location')}</td>
                <td style={S.td} colSpan={5}>{[fi?.spouse_birth_commune,fi?.spouse_birth_district,fi?.spouse_birth_province].filter(Boolean).join(' / ')||'—'}</td>
              </tr>
              <tr>
                <td style={S.lbl} >- {t('current_location')} </td>
                <td style={S.td} colSpan={5}>{[fi?.spouse_current_commune,fi?.spouse_current_district,fi?.spouse_current_province].filter(Boolean).join(' / ')||'—'}</td>
              </tr>
              <tr>
                <td style={S.lbl2}>- {t('marriage_cert_no')} </td>
                <td style={S.td} colSpan={5}>
                  {fi?.marriage_certificate_number || '—'}
                  {fi?.marriage_certificate_date && <span style={{marginLeft:12,color:'#888'}}>({formatDateDisplay(fi.marriage_certificate_date, i18n.language)})</span>}
                </td>
              </tr>
            </>)}

            {/* Children count */}
            <tr>
              <td style={S.lbl}>- {t('num_children')}</td>
              <td style={S.td} colSpan={5}>
               {t('child_total')} {formatNumberDisplay(fi?.number_of_children||0, i18n.language)}
               {' , '} {t('male_children')} {formatNumberDisplay(fi?.male_children_count||0, i18n.language)} , {t('female_children')} {formatNumberDisplay(fi?.female_children_count||0, i18n.language)}
              </td>
            </tr>

            {/* Children list */}
            {fi?.children?.length > 0 && (
              <tr>
                <td style={{...S.lbl,verticalAlign:'top',paddingTop:8}}>- {t('child_name')} </td>
                <td style={S.td} colSpan={5}>
                  {fi.children.map((child, idx) => (
                    <div key={child.id ?? idx} style={{display:'flex',alignItems:'center',gap:8,marginBottom:5}}>
                      <div style={{width:'50%',display:'flex',alignItems:'center',gap:4}}>
                        <span style={{fontSize:16,color:'#666',minWidth:20}}>{formatNumberDisplay(idx+1, i18n.language)}.</span>
                        <span style={{flex:1}}>{child.name||'—'}</span>
                      </div>
                      <div style={{width:'50%',display:'flex',alignItems:'center',gap:4}}>
                        <span style={{color:'#888'}}>{t('child_dob')} {formatDateDisplay(child.date_of_birth, i18n.language)}</span>
                      </div>
                    </div>
                  ))}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PersonalInfoDetail;
