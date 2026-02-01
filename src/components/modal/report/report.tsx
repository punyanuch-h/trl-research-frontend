import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

// Register Fonts
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

const fixThaiEndLine = (text: string | undefined | null) => {
  if (!text) return '-';
  
  return text.split('\n').map(line => {
    const lastThree = line.slice(-3);
    const hasThai = /[\u0E00-\u0E7F]/.test(lastThree);
    
    return hasThai ? line + "  " : line;
  }).join('\n');
};

// Thai Word Wrapping Logic
// Font.registerHyphenationCallback(word => {
//   if (word.length < 2) return [word];

//   try {
//     if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
//       const segmenter = new (Intl as any).Segmenter('th', { granularity: 'word' });
//       return Array.from(segmenter.segment(word)).map((x: any) => x.segment);
//     }
//   } catch (e) {}
//     return word.split("");
// });


// Font.registerHyphenationCallback(word => {
//   if (word.length < 2) return [word];

//   let results: string[] = [];

//   try {
//     if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
//       const segmenter = new (Intl as any).Segmenter('th', { granularity: 'word' });
//       const segments = Array.from(segmenter.segment(word));
      
//       segments.forEach(({ segment }: { segment: string }) => {
//         const characters = segment.split("");
        
//         characters.forEach((char) => {
//           if (/^[\u0E30-\u0E3A\u0E47-\u0E4E\u0E31]/.test(char) && results.length > 0) {
//             results[results.length - 1] += char;
//           } else {
//             results.push(char);
//           }
//         });
//       });
      
//       return results.filter(s => s !== "");
//     }
//   } catch (e) {
//     console.error("Segmenter error:", e);
//   }
  
//   return word.split(""); 
// });

// Font.registerHyphenationCallback(word => {
//   if (word.length < 2) return [word];

//   let results: string[] = [];

//   try {
//     if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
//       const segmenter = new (Intl as any).Segmenter('th', { granularity: 'word' });
//       const segments = Array.from(segmenter.segment(word));
//       const words = segments.map((x: any) => x.segment);
      
//       // รวมสระบน-ล่าง วรรณยุกต์ และสระจมทั้งหมด
//       const isThaiVowelOrTone = /^[\u0E30-\u0E3A\u0E47-\u0E4E\u0E31]/;

//       words.forEach((w) => {
//         // ถ้าคำใหม่ขึ้นต้นด้วยสระหรือวรรณยุกต์ ให้ดึงตัวหน้าลงมาเรื่อยๆ จนกว่าหน้าประโยคจะไม่ใช่สระ
//         if (results.length > 0 && isThaiVowelOrTone.test(w)) {
//           let currentFragment = w;
//           let lastWord = results[results.length - 1];

//           // Loop ตรวจสอบ: ถ้าคำที่ดึงมายังขึ้นต้นด้วยสระ ให้ดึงพยัญชนะจากก้อนก่อนหน้ามาเพิ่ม
//           while (lastWord.length > 0 && isThaiVowelOrTone.test(currentFragment)) {
//             const lastChar = lastWord.slice(-1); // ดึงตัวท้ายสุด
//             currentFragment = lastChar + currentFragment; // เอาไปแปะหน้าก้อนปัจจุบัน
//             lastWord = lastWord.slice(0, -1);
//             console.log("Pulling down character:", lastChar, "to join with", w); // ตัดตัวที่ดึงไปแล้วออกจากก้อนเก่า
//           }

//           results[results.length - 1] = lastWord; // อัปเดตก้อนเก่าที่ถูกดึงของไป
//           results.push(currentFragment); // เพิ่มก้อนใหม่ที่สมบูรณ์แล้วเข้าไป
//         } else {
//           results.push(w);
//         }
//       });
      
//       return results.filter(s => s !== "");
//     }
//   } catch (e) {
//     console.error("Segmenter error:", e);
//   }
  
//   return word.split(""); 
// });

// 1. Logic ดึงพยัญชนะที่ปรับปรุง Regex แล้ว
// Font.registerHyphenationCallback(word => {
//   if (word.length < 2) return [word];
//   let results: string[] = [];
//   const isThaiVowelOrTone = /^[ะาำิีึืุู็่้๊๋์ั]/; // เพิ่ม สระ า และ ำ

//   try {
//     if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
//       const segmenter = new (Intl as any).Segmenter('th', { granularity: 'word' });
//       const words = Array.from(segmenter.segment(word)).map((x: any) => x.segment);
      
//       // words.forEach((w) => {
//       //   if (results.length > 0 && isThaiVowelOrTone.test(w)) {
//       //     let currentFragment = w;
//       //     let lastWord = results[results.length - 1];
//       //     while (lastWord.length > 0 && isThaiVowelOrTone.test(currentFragment)) {
//       //       const lastChar = lastWord.slice(-1);
//       //       currentFragment = lastChar + currentFragment;
//       //       lastWord = lastWord.slice(0, -1);
//       //       console.log("Pulling down character:", lastChar, "to join with", w);

//       //     }
//       //     results[results.length - 1] = lastWord;
//       //     results.push(currentFragment);
//       //   } else {
//       //     results.push(w);
//       //   }
//       // });
//       words.forEach((w) => {
//         // ถ้าส่วนใหม่ (w) ขึ้นต้นด้วยสระ
//         if (results.length > 0 && isThaiVowelOrTone.test(w)) {
//           let currentFragment = w;
//           let lastWord = results[results.length - 1];

//           // Loop จะทำงานกี่รอบก็ได้ จนกว่าตัวหน้าสุดของ currentFragment จะไม่ใช่สระ
//           while (lastWord.length > 0 && isThaiVowelOrTone.test(currentFragment)) {
//             const lastChar = lastWord.slice(-1); // ดึงตัวท้ายจากก้อนก่อนหน้า
//             currentFragment = lastChar + currentFragment; // เอามาแปะหน้า
//             lastWord = lastWord.slice(0, -1); // ตัดออกจากก้อนเดิม
            
//             // Log ดูว่ามันดึงกี่รอบ
//             console.log(`Looping: Pulling "${lastChar}" to join, Now fragment is: "${currentFragment}"`);
//           }

//           results[results.length - 1] = lastWord;
//           results.push(currentFragment);
//         } else {
//           results.push(w);
//         }
//       });
//       return results.filter(s => s !== "");
//     }
//   } catch (e) {}
//   return word.split(""); 
// });

// Thai Word Wrapping Logic - บังคับเช็คละเอียดทุกตัวอักษรทั่วทั้ง PDF
Font.registerHyphenationCallback(word => {
  if (word.length < 2) return [word];

  let results: string[] = [];
  // Regex ครอบคลุมสระบน-ล่าง วรรณยุกต์ และตัวการันต์ไทยทั้งหมด
  const isThaiVowelOrTone = /^[ะาำิีึืุู็่้๊๋์ั]/;

  try {
    if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
      const segmenter = new (Intl as any).Segmenter('th', { granularity: 'word' });
      const segments = Array.from(segmenter.segment(word));
      
      segments.forEach(({ segment }) => {
        // ย่อยคำออกมาเป็นตัวอักษร เพื่อให้ PDF สามารถตัดบรรทัดได้ทุกตำแหน่งที่เป็นพยัญชนะ
        const chars = segment.split("");
        chars.forEach((char) => {
          // ถ้าเป็นสระ/วรรณยุกต์ -> ให้รวบเข้ากับตัวข้างหน้าเสมอ (ห้ามแยกบรรทัด)
          if (results.length > 0 && isThaiVowelOrTone.test(char)) {
            results[results.length - 1] += char;
          } else {
            // ถ้าเป็นพยัญชนะ -> แยกเป็นส่วนใหม่ (เป็นจุดที่ PDF สามารถตัดขึ้นบรรทัดใหม่ได้)
            results.push(char);
          }
        });
      });
      
      return results.filter(s => s !== "");
    }
  } catch (e) {
    console.error("Segmenter error:", e);
  }
  
  return word.split(""); 
});

  // const results = [];
  // let currentBuffer = "";
  
  // for (let i = 0; i < word.length; i++) {
  //   const char = word[i];
  //   const isUpperLower = /[\u0E30-\u0E3A\u0E47-\u0E4E\u0E31]/.test(char);

  //   if (isUpperLower) {
  //     currentBuffer += char;
  //   } else {
  //     if (currentBuffer) results.push(currentBuffer);
  //     currentBuffer = char;
  //   }
  // }
  // if (currentBuffer) results.push(currentBuffer);
  
  // return results;


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
    padding: 60,
    fontFamily: 'Sarabun',
    fontSize: 10,
    backgroundColor: '#ffffff',
    color: '#000000',
    lineHeight: 1.5,
  },
  // Header
  header: {
    textAlign: 'center',
    marginBottom: 30,
  },
  // Titles
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textDecoration: 'underline',
    marginBottom: 10,
  },
  reportSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerInfo: {
    fontSize: 10,
    marginTop: 5,
  },
  // Sectioning
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1.5,
    borderBottomColor: '#000000',
    paddingBottom: 6,
    marginBottom: 10,
    lineHeight: 1.2,
  },
  // Data Grid
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: '30%',
    fontWeight: 'bold',
  },
  value: {
    width: '70%',
    lineHeight: 1,
  },
  entryDivider: {
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#cccccc',
  },
});

interface Props {
  c: any;
  coordinatorData?: any;
  appointments?: any[];
  ipList?: any[];
  supportmentData?: any;
  assessmentData?: any;
}

export const CaseReportPDF: React.FC<Props> = ({ 
  c, 
  coordinatorData, 
  appointments = [], 
  ipList = [], 
  supportmentData,
  assessmentData,
}) => {
  // Prepare short 'lead' slices so we can keep the header with the
  // first visible line. The lead length is conservative and can be tuned.
  const additionalNeedFull = supportmentData?.need || "";
  const additionalNeedLead = additionalNeedFull.length > 140 ? additionalNeedFull.slice(0, 140) : additionalNeedFull;
  const additionalNeedRest = additionalNeedFull.length > 140 ? additionalNeedFull.slice(140) : "";

  const improvementFull = assessmentData?.improvement_suggestion || "";
  const improvementLead = improvementFull.length > 180 ? improvementFull.slice(0, 180) : improvementFull;
  const improvementRest = improvementFull.length > 180 ? improvementFull.slice(180) : "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.reportTitle}>{c.title || 'N/A'}</Text>
          <View style={styles.headerInfo}>
            <Text>Case ID: {c.id || '-'}</Text>
            <Text>Printed Date: {formatDate(new Date(), true)}</Text>
          </View>
        </View>

        {/* 1. Project Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} wrap={false}>Project Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Submission Date:</Text>
            <Text style={styles.value}>{formatDate(c.created_at)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Type of Innovation:</Text>
            <Text style={styles.value}>{c.type || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>TRL Level:</Text>
            <Text style={styles.value}>{c.trl_score ?? '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Keywords:</Text>
            <Text style={styles.value}>{fixThaiEndLine(c.keywords) || '-'}</Text>
          </View>
          <View>
            <Text style={[styles.label, { width: '100%', marginTop: 5, marginBottom: 3 }]}>Project Description:</Text>
            <Text style={{ 
              fontSize: 10, 
              textAlign: 'justify', 
              lineHeight: 1.5,
              textIndent: 20,
              marginTop: 3,
              marginBottom: 5,
            }}>
              {fixThaiEndLine(c.description) || '-'}
            </Text>
          </View>
        </View>

        {/* 2. Personnel in Charge */}
        {coordinatorData && (
          <View style={styles.section}>
            <View wrap={false}>
              <Text style={styles.sectionTitle} wrap={false}>Personnel in Charge</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Coordinator:</Text>
                <Text style={styles.value}>{fixThaiEndLine(coordinatorData.first_name)} {fixThaiEndLine(coordinatorData.last_name)}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Contact:</Text>
              <Text style={styles.value}>{coordinatorData.email || '-'} / Tel: {coordinatorData.phone_number || '-'}</Text>
            </View>
          </View>
        )}

        {/* 3. Activity & Follow-up Log (Appointments) */}
        {appointments.length > 0 && (
          <View style={styles.section}>
            {appointments.map((a, i) => (
              <React.Fragment key={i}>
                {i === 0 ? (
                  <View wrap={false}>
                    <Text style={styles.sectionTitle} wrap={false}>Follow-up & Activity Log</Text>
                    <View style={styles.row} wrap={false}>
                      <Text style={styles.label}>Date & Time:</Text>
                      <Text style={styles.value}>{formatDate(a.date, true)}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.row} wrap={false}>
                    <Text style={styles.label}>Date & Time:</Text>
                    <Text style={styles.value}>{formatDate(a.date, true)}</Text>
                  </View>
                )}
                <View style={styles.row} wrap={false}>
                  <Text style={styles.label}>Status:</Text>
                  <Text style={{ ...styles.value, fontWeight: 'bold' }}>{a.status?.toUpperCase() || '-'}</Text>
                </View>
                <View style={styles.row} wrap={false}>
                  <Text style={styles.label}>Location:</Text>
                  <Text style={styles.value}>{fixThaiEndLine(a.location) || '-'}</Text>
                </View>
                <View>
                  <Text style={[styles.label, { width: '100%', marginTop: 5, marginBottom: 3 }]}>Summary:</Text>
                  <Text style={{ 
                    fontSize: 10, 
                    textAlign: 'justify', 
                    lineHeight: 1.5,
                    textIndent: 20,
                    marginTop: 3,
                    marginBottom: 5,
                  }}>
                    {fixThaiEndLine(a.summary) || '-'}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.label, { width: '100%', marginTop: 5, marginBottom: 3 }]}>Details:</Text>
                  <Text style={{ 
                    fontSize: 10, 
                    textAlign: 'justify', 
                    lineHeight: 1.5,
                    textIndent: 20,
                    marginTop: 3,
                    marginBottom: 5,
                  }}>
                    {fixThaiEndLine(a.detail) || '-'}
                  </Text>
                </View>
                {i < appointments.length - 1 && <View style={styles.entryDivider}/>}
              </React.Fragment>
            ))}
          </View>
        )}

        {/* 4. Intellectual Property */}
        {ipList.length > 0 && (
          <View style={styles.section}>
            {ipList.map((ip, i) => (
              <React.Fragment key={i}>
                {i === 0 ? (
                  <View wrap={false}>
                    <Text style={styles.sectionTitle} wrap={false}>Intellectual Property Status</Text>
                    <View style={styles.row} wrap={false}>
                      <Text style={styles.label}>IP Type:</Text>
                      <Text style={styles.value}>{ip.types?.toUpperCase() || '-'}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.row} wrap={false}>
                    <Text style={styles.label}>IP Type:</Text>
                    <Text style={styles.value}>{ip.types?.toUpperCase() || '-'}</Text>
                  </View>
                )}
                <View style={styles.row} wrap={false}>
                  <Text style={styles.label}>Reference Number:</Text>
                  <Text style={styles.value}>{ip.request_number || '-'}</Text>
                </View>
                <View style={styles.row} wrap={false}>
                  <Text style={styles.label}>Status:</Text>
                  <Text style={{ ...styles.value}}>{ip.protection_status || '-'}  </Text>
                </View>
                {i < ipList.length - 1 && <View style={styles.entryDivider} />}
              </React.Fragment>
            ))}
          </View>
        )}

        {/* 5. Supporter Information */}
        {supportmentData && (
          <View style={styles.section}>
            <View wrap={false}>
              <Text style={styles.sectionTitle} wrap={false}>Supporter Information</Text>

              {/* หน่วยงานสนับสนุนเดิม */}
              <View style={{ flexWrap: 'wrap' }}>
                <Text style={[styles.label, { width: '100%', marginTop: 3, marginBottom: 3 }]}>Existing Support:</Text>

                {(supportmentData.support_research || supportmentData.support_vdc || supportmentData.support_sieic) ? (
                
                <View style={{ marginLeft: 20 }}>
                  {supportmentData.support_research && <Text style={styles.value}>• ฝ่ายวิจัย (Research Division)  </Text>}
                  {supportmentData.support_vdc && <Text style={styles.value}>• ศูนย์ขับเคลื่อนคุณค่าการบริการ (VDC)  </Text>}
                  {supportmentData.support_sieic && <Text style={styles.value}>• ศูนย์ขับเคลื่อนงานนวัตกรรมเพื่อความเป็นเลิศ (SiEIC)  </Text>}
                </View>
                
              ) : (
                <Text style={[styles.value, { marginLeft: 20 }]}>ไม่มีหน่วยงานสนับสนุนนวัตกรรม  </Text>
              )}
              </View>
            </View>

            {/* ความช่วยเหลือที่ต้องการ */}
            <View style={{ flexWrap: 'wrap' }}>
              <Text style={[styles.label, { width: '100%', marginTop: 3, marginBottom: 3 }]}>Requirements & Assistance Needed:</Text>
              
              {/* ตรวจสอบว่ามีความต้องการไหม */}
              {(supportmentData.need_protect_intellectual_property || supportmentData.need_co_developers || 
                supportmentData.need_activities || supportmentData.need_test || supportmentData.need_capital || 
                supportmentData.need_partners || supportmentData.need_guidelines || 
                supportmentData.need_certification || supportmentData.need_account) ? (
                
                <View style={{ marginLeft: 20 }}>
                  {supportmentData.need_protect_intellectual_property && <Text style={styles.value}>• การคุ้มครองทรัพย์สินทางปัญญา  </Text>}
                  {supportmentData.need_co_developers && <Text style={styles.value}>• หาผู้ร่วม/โรงงานผลิตและพัฒนานวัตกรรม  </Text>}
                  {supportmentData.need_activities && <Text style={styles.value}>• จัดกิจกรรมร่วม เช่น Design Thinking, Prototype Testing  </Text>}
                  {supportmentData.need_test && <Text style={styles.value}>• หาผู้ร่วมหรือสถานที่ทดสอบนวัตกรรม </Text>}
                  {supportmentData.need_capital && <Text style={styles.value}>• หาแหล่งทุน  </Text>}
                  {supportmentData.need_partners && <Text style={styles.value}>• หาคู่ค้าทางธุรกิจ  </Text>}
                  {supportmentData.need_guidelines && <Text style={styles.value}>• แนะนำแนวทางการเริ่มธุรกิจ  </Text>}
                  {supportmentData.need_certification && <Text style={styles.value}>• การขอรับรองมาตรฐานหรือคุณภาพ  </Text>}
                  {supportmentData.need_account && <Text style={styles.value}>• บัญชีสิทธิประโยชน์/บัญชีนวัตกรรม  </Text>}
                </View>
                
              ) : (
                <Text style={[styles.value, { marginLeft: 20 }]}>ไม่ต้องการความช่วยเหลือเพิ่มเติม  </Text>
              )}
            </View>

            {/* ความต้องการอื่นๆ */}
            {supportmentData.need && (
              <View>
                <View minPresenceAhead={80}>
                  <Text style={[styles.label, { width: '100%', marginTop: 5, marginBottom: 3 }]}>Additional Requirements:</Text>
                  <Text style={{ 
                    fontSize: 10, 
                    textAlign: 'justify', 
                    lineHeight: 1.5,
                    textIndent: 20,
                    marginTop: 3,
                    marginBottom: 5,
                  }}>
                    {fixThaiEndLine(supportmentData.need || '-')}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* 6. Improvement Suggestions */}
        {assessmentData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle} wrap={false}>Improvement Suggestions</Text>
            <Text style={{ 
              fontSize: 10, 
              textAlign: 'justify', 
              lineHeight: 1.6,
              textIndent: 20,
              marginRight: 10,
              marginTop: 5,
            }}>
              {assessmentData.improvement_suggestion ? (
                fixThaiEndLine(assessmentData.improvement_suggestion)
              ) : (
                "Excellent Progress: All evaluated Technology Readiness Level (TRL) criteria have been addressed. No further technical adjustments are recommended at this stage."                )}
            </Text>
          </View>
        )}

      </Page>
    </Document>
  );
};