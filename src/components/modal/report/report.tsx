import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { radioQuestionList } from '@/data/radioQuestionList';
import { checkboxQuestionList } from '@/data/checkboxQuestionList';

try {
  Font.register({
    family: "Sarabun",
    fonts: [
      { src: "assets/fonts/Sarabun-Regular.ttf" },
      { src: "assets/fonts/Sarabun-Bold.ttf", fontWeight: "bold" },
      { src: "assets/fonts/Sarabun-Italic.ttf", fontStyle: "italic" },
      { src: "assets/fonts/Sarabun-BoldItalic.ttf", fontWeight: "bold", fontStyle: "italic" },
    ],
  });
} catch (e) {
  console.error("Error registering font:", e);
}

Font.registerHyphenationCallback(word => {
  if (word.length < 2) return [word];

  try {
    if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
      const segmenter = new (Intl as any).Segmenter('th', { granularity: 'word' });
      return Array.from(segmenter.segment(word)).map((x: any) => x.segment);
    }
  } catch (e) {
    // ignore error
  }

  const results = [];
  let currentBuffer = "";
  
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const isUpperLower = /[\u0E30-\u0E3A\u0E47-\u0E4E\u0E31]/.test(char);

    if (isUpperLower) {
      currentBuffer += char;
    } else {
      if (currentBuffer) results.push(currentBuffer);
      currentBuffer = char;
    }
  }
  if (currentBuffer) results.push(currentBuffer);
  
  return results;
});

const formatDate = (dateString: string | Date | undefined, withTime: boolean = false) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    const pattern = withTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy";
    return format(date, pattern, { locale: th });
  } catch (e) {
    return '-';
  }
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Sarabun',
    fontSize: 12,
    backgroundColor: '#ffffff',
    color: '#1f2937',
    minHeight: '297mm',
  },
  // Header Section
  headerContainer: {
    textAlign: 'center',
    marginBottom: 26,
    paddingBottom: 15,
    borderBottomWidth: 3,
    borderBottomColor: '#3b515e',
  },
  headerTitle: {
    margin: 0,
    fontSize: 30,
    color: '#3b515e',
    fontWeight: 'bold',
  },
  headerSubTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 600,
    color: '#3b515e',
  },
  headerCaseId: {
    marginTop: 4,
    fontSize: 10,
    color: '#65758b',
  },
  // Section Box
  section: {
    marginTop: 25,
    padding: 15,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
  },
  sectionHeader: {
    borderBottomWidth: 3,
    borderBottomColor: '#00c1d6',
    paddingBottom: 8,
    marginBottom: 15,
    fontSize: 16,
    color: '#00c1d6',
    fontWeight: 600,
  },
  // Grid/Flex Layout
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  col50: {
    width: '50%',
    marginBottom: 8,
  },
  col100: {
    width: '100%',
    marginBottom: 8,
  },
  // Text Styles
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  value: {
    color: '#3b515e',
  },
  // List Item (Bullet points)
  listItem: {
    flexDirection: 'row',
    marginBottom: 4,
    marginLeft: 0, 
  },
  bullet: {
    width: 20,
    textAlign: 'center',
    color: '#3b515e',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listText: {
    fontSize: 12,
    color: '#3b515e',
    lineHeight: 1.6,
  },
  // Appointment Item
  appointmentItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    paddingBottom: 25,
    marginTop: 23,
  },
  appointmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  // Footer
  footer: {
    textAlign: 'center',
    marginTop: 30,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
    color: '#9ca3af',
    fontSize: 10,
  },
  questionRow: {
    flexDirection: 'row',
    marginBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 6,
    alignItems: 'flex-start'
  },
  questionIndex: {
    width: 20,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00c1d6',
  },
  questionText: {
    flex: 1,
    fontSize: 12,
    color: '#374151',
    paddingRight: 10,
  },
  answerBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    width: 60,
    textAlign: 'center',
  },
  trlLevelHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3b515e',
    marginTop: 10,
    marginBottom: 6,
    backgroundColor: '#f3f4f6',
    padding: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    marginBottom: 4,
    marginLeft: 10,
  },
  checkboxIcon: {
    width: 15,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

interface Props {
  c: any;
  coordinatorData?: any;
  appointments?: any[];
  ipList?: any[];
  supporterData?: any;
  assessmentData?: any;
}

export const CaseReportPDF: React.FC<Props> = ({ 
  c, 
  coordinatorData, 
  appointments = [], 
  ipList = [], 
  supporterData,
  assessmentData,
}) => {

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'attended': return '#10b981';
      case 'absent': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getRQAnswer = (questionIndex: number) => {
    if (!assessmentData) return null;
    const rqKeys = ['rq1_answer', 'rq2_answer', 'rq3_answer', 'rq4_answer', 'rq5_answer', 'rq6_answer', 'rq7_answer'];
    return assessmentData[rqKeys[questionIndex]];
  };

  const getCQAnswer = (questionIndex: number) => {
    if (!assessmentData) return [];
    const cqKeys = ['cq1_answer', 'cq2_answer', 'cq3_answer', 'cq4_answer', 'cq5_answer', 'cq6_answer', 'cq7_answer', 'cq8_answer', 'cq9_answer'];
    return assessmentData[cqKeys[questionIndex]] || [];
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>INNOVATION CASE DETAIL REPORT</Text>
          <Text style={styles.headerSubTitle}>{c.case_title || 'N/A'}</Text>
          <Text style={styles.headerCaseId}>
            Case ID: <Text style={{ fontWeight: 'bold', color: '#65758b' }}>{c.case_id || 'N/A'}</Text>
          </Text>
        </View>

        {/* Case Details */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Case Details</Text>
          <View style={styles.rowWrap}>
            <View style={styles.col50}><Text><Text style={styles.label}>Case Name: </Text><Text style={styles.value}>{c.case_title || '-'}</Text></Text></View>
            <View style={styles.col50}><Text><Text style={styles.label}>Case ID: </Text><Text style={styles.value}>{c.case_id || '-'}</Text></Text></View>
            <View style={styles.col50}><Text><Text style={styles.label}>Type: </Text><Text style={styles.value}>{c.case_type || '-'}</Text></Text></View>
            <View style={styles.col50}><Text><Text style={styles.label}>TRL Score: </Text><Text style={styles.value}>{c.trl_score ?? '-'}</Text></Text></View>
            <View style={styles.col50}><Text><Text style={styles.label}>Submitted at: </Text><Text style={styles.value}>{formatDate(c.created_at, true)}</Text></Text></View>
          </View>
          <View style={{ marginTop: 15, marginBottom: 10 }}>
            <Text style={{ marginBottom: 8 }}><Text style={styles.label}>Description: </Text><Text style={styles.value}>{c.case_description || '-'}</Text></Text>
            <Text style={{ marginBottom: 8 }}><Text style={styles.label}>Keywords: </Text><Text style={styles.value}>{c.case_keywords || '-'}</Text></Text>
          </View>
        </View>

        {/* Coordinator */}
        {coordinatorData && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Coordinator</Text>
            <View style={{ ...styles.rowWrap, marginBottom: 10 }}>
              <View style={styles.col50}><Text><Text style={styles.label}>Name: </Text><Text style={styles.value}>{coordinatorData.coordinator_name || '-'}</Text></Text></View>
              <View style={styles.col50}><Text><Text style={styles.label}>Tel: </Text><Text style={styles.value}>{coordinatorData.coordinator_phone || '-'}</Text></Text></View>
              <View style={styles.col100}><Text><Text style={styles.label}>Email: </Text><Text style={styles.value}>{coordinatorData.coordinator_email || '-'}</Text></Text></View>
            </View>
          </View>
        )}

        {/* Appointments */}
        {appointments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Appointments</Text>
            {appointments.map((a, index) => (
              <View key={index} style={styles.appointmentItem} wrap={false}>
                <View style={styles.appointmentRow}>
                  <Text style={{ fontSize: 10 }}><Text style={styles.label}>ID: </Text><Text style={styles.value}>{a.appointment_id}</Text></Text>
                  <Text style={{ fontSize: 10 }}><Text style={styles.label}>วันที่นัดหมาย: </Text><Text style={styles.value}>{formatDate(a.date, true)}</Text></Text>
                </View>
                <Text style={{ marginVertical: 4 }}><Text style={styles.label}>สถานที่: </Text><Text style={styles.value}>{a.location || '-'}</Text></Text>
                <Text style={{ marginVertical: 4 }}>
                  <Text style={styles.label}>สถานะ: </Text>
                  <Text style={{ fontWeight: 'bold', color: getStatusColor(a.status) }}>{a.status || '-'}</Text>
                </Text>
                {a.summary && <Text style={{ marginVertical: 4 }}><Text style={styles.label}>สรุปการประชุม: </Text><Text style={styles.value}>{a.summary}</Text></Text>}
                {a.note && <Text style={{ marginVertical: 4 }}><Text style={styles.label}>หมายเหตุ: </Text><Text style={styles.value}>{a.note}</Text></Text>}
              </View>
            ))}
          </View>
        )}

        {/* Intellectual Property */}
        {ipList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Intellectual Property</Text>
            {ipList.map((ip, index) => (
              <View key={index} style={{ ...styles.appointmentItem, paddingBottom: 15 }}>
                <View style={styles.rowWrap}>
                  <View style={styles.col50}><Text><Text style={styles.label}>ประเภท: </Text><Text style={styles.value}>{ip.ip_types || '-'}</Text></Text></View>
                  <View style={styles.col50}><Text><Text style={styles.label}>สถานะ: </Text><Text style={styles.value}>{ip.ip_protection_status || '-'}</Text></Text></View>
                  <View style={styles.col50}><Text><Text style={styles.label}>เลขที่คำขอ: </Text><Text style={styles.value}>{ip.ip_request_number || '-'}</Text></Text></View>
                  <View style={styles.col50}><Text><Text style={styles.label}>สร้างเมื่อ: </Text><Text style={styles.value}>{formatDate(ip.created_at)}</Text></Text></View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Supporter Information */}
        {supporterData && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Supporter Information</Text>

            {/* หน่วยงานสนับสนุน */}
            <View style={{ marginTop: 15, borderBottomWidth: 1, borderBottomColor: '#d1d5db', paddingBottom: 20 }}>
              <Text style={{ ...styles.label, marginBottom: 8, fontSize: 12 }}>หน่วยงานสนับสนุนนวัตกรรมที่มีอยู่เดิม</Text>
              {(supporterData.support_research || supporterData.support_vdc || supporterData.support_sieic) ? (
                <View style={{ marginLeft: 15 }}>
                  {supporterData.support_research && <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listText}>ฝ่ายวิจัย (Research Division)</Text></View>}
                  {supporterData.support_vdc && <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listText}>ศูนย์ขับเคลื่อนคุณค่าการบริการ (VDC)</Text></View>}
                  {supporterData.support_sieic && <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listText}>ศูนย์ขับเคลื่อนงานนวัตกรรมเพื่อความเป็นเลิศ (SiEIC)</Text></View>}
                </View>
              ) : (
                <Text style={{ ...styles.value, fontSize: 12, marginLeft: 10 }}>ไม่มีหน่วยงานสนับสนุนนวัตกรรม</Text>
              )}
            </View>

            {/* ความช่วยเหลือที่ต้องการ */}
            <View style={{ marginTop: 23, borderBottomWidth: 1, borderBottomColor: '#d1d5db', paddingBottom: 20 }}>
              <Text style={{ ...styles.label, marginBottom: 8, fontSize: 12 }}>ความช่วยเหลือที่ต้องการ</Text>
              {(supporterData.need_protect_intellectual_property || supporterData.need_co_developers || supporterData.need_activities || supporterData.need_test || supporterData.need_capital || supporterData.need_partners || supporterData.need_guidelines || supporterData.need_certification || supporterData.need_account) ? (
                <View style={{ marginLeft: 15 }}>
                   {supporterData.need_protect_intellectual_property && <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listText}>การคุ้มครองทรัพย์สินทางปัญญา</Text></View>}
                   {supporterData.need_co_developers && <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listText}>หาผู้ร่วม/โรงงานผลิตและพัฒนานวัตกรรม</Text></View>}
                   {supporterData.need_activities && <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listText}>จัดกิจกรรมร่วม เช่น Design Thinking, Prototype Testing</Text></View>}
                   {supporterData.need_test && <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listText}>หาผู้ร่วมหรือสถานที่ทดสอบนวัตกรรม</Text></View>}
                   {supporterData.need_capital && <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listText}>หาแหล่งทุน</Text></View>}
                   {supporterData.need_partners && <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listText}>หาคู่ค้าทางธุรกิจ</Text></View>}
                   {supporterData.need_guidelines && <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listText}>แนะนำแนวทางการเริ่มธุรกิจ</Text></View>}
                   {supporterData.need_certification && <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listText}>การขอรับรองมาตรฐานหรือคุณภาพ</Text></View>}
                   {supporterData.need_account && <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listText}>บัญชีสิทธิประโยชน์/บัญชีนวัตกรรม</Text></View>}
                </View>
              ) : (
                <Text style={{ ...styles.value, fontSize: 12, marginLeft: 10 }}>ไม่ต้องการความช่วยเหลือ</Text>
              )}
            </View>

            {/* ความต้องการอื่นๆ */}
            {supporterData.need && (
              <View style={{ marginTop: 15, paddingTop: 5 }}>
                <Text style={{ ...styles.label, marginBottom: 4, fontSize: 12 }}>ความต้องการอื่นๆ</Text>
                <Text style={{ ...styles.value, fontSize: 12, marginLeft: 10, padding: 8 }}>{supporterData.need}</Text>
              </View>
            )}

            {/* เอกสารเพิ่มเติม */}
            {supporterData.additional_documents && (
              <View style={{ marginTop: 15, marginBottom: 10 }}>
                <Text style={{ ...styles.label, marginBottom: 4, fontSize: 12 }}>เอกสารเพิ่มเติม</Text>
                <Text style={{ ...styles.value, fontSize: 12, marginLeft: 10, padding: 8 }}>{supporterData.additional_documents}</Text>
              </View>
            )}
          </View>
        )}

        {/* Improvement Suggestions */}
        {assessmentData && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Improvement Suggestion</Text>

            <View style={{ marginTop: 10 }}>
              {assessmentData.improvement_suggestion ? (
                <Text style={{ ...styles.value, fontSize: 12, lineHeight: 1.8 }}>
                  {assessmentData.improvement_suggestion}
                </Text>
              ) : (
                <Text style={{ ...styles.value, fontSize: 12, fontStyle: 'italic', color: '#10b981' }}>
                  Excellent Progress! (All TRL criteria have been addressed)
                </Text>
              )}
            </View>
          </View>
        )}

        {/* General Assessment Questions */}
        {assessmentData && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>General Assessment Questions</Text>
            {radioQuestionList.map((question, index) => {
              const answer = getRQAnswer(index);
              return (
                <View key={index} style={styles.questionRow} wrap={false}>
                  <Text style={styles.questionIndex}>{index + 1}.</Text>
                  <Text style={styles.questionText}>{question}</Text>
                  <Text style={{
                    ...styles.answerBadge,
                    color: answer === true ? '#047857' : (answer === false ? '#b91c1c' : '#6b7280'),
                    backgroundColor: answer === true ? '#d1fae5' : (answer === false ? '#fee2e2' : '#f3f4f6')
                  }}>
                    {answer === true ? 'ใช่' : (answer === false ? 'ไม่ใช่' : 'N/A')}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* TRL Evaluation Criteria (Selected Only) */}
        {assessmentData && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>TRL Evaluation Criteria</Text>
            {checkboxQuestionList.map((questions, levelIndex) => {
              const selectedAnswers = getCQAnswer(levelIndex);
              
              const tickedQuestions = questions.filter(q => selectedAnswers.includes(q.label));
              if (tickedQuestions.length === 0) return null;

              return (
                <View key={levelIndex} wrap={false} style={{ marginBottom: 12 }}>
                  <Text style={styles.trlLevelHeader}>
                    TRL Level {levelIndex + 1} 
                    <Text style={{ fontSize: 10, fontWeight: 400, color: '#6b7280' }}> ({tickedQuestions.length} items)</Text>
                  </Text>

                  {tickedQuestions.map((q) => (
                    <View key={q.id} style={styles.checkboxRow}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={{ ...styles.listText, color: '#1f2937' }}>
                        {q.label}
                      </Text>
                    </View>
                  ))}
                </View>
              );
            })}
            
            {checkboxQuestionList.every((_, idx) => getCQAnswer(idx).length === 0) && (
               <Text style={{ textAlign: 'center', color: '#9ca3af', fontStyle: 'italic', padding: 20 }}>
                 - No criteria selected -
               </Text>
            )}
          </View>
        )}
        
        {/* Footer */}
        <Text style={styles.footer}>
          Generated on {formatDate(new Date(), true)}
        </Text>

      </Page>
    </Document>
  );
};