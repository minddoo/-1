const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { SolapiMessageService } = require('solapi');

const { Resend } = require('resend');

admin.initializeApp();
const db = admin.firestore();

// 솔라피 서비스 초기화 (v5 기준)
const messageService = new SolapiMessageService(
  'NCS3LR13SE2MENQS', 
  'HB0SBNAPBBULLWL3EXPTH6QPQYKKYPGD'
);

// 리센드(이메일) 초기화
const resend = new Resend('re_JHDg5G7V_9wGs34JsnsssSdP1y9ctiBMx');

// 솔라피 템플릿 텍스트 자동 구성 헬퍼 (v5 필수 text 필드 누락 방지)
function getAlimtalkTemplateText(name, dDayText, customNotice) {
  return `[체킷(CHECKIT) 검진 가이드]

안녕하세요, ${name}님!
고객님께서 예약하신 건강검진일이 ${dDayText}일 앞으로 다가왔습니다. 🚀

안전하고 정확한 검진을 위해 아래 사전 안내사항을 꼭 확인해 주세요.

▶ 검진 사전 안내
${customNotice}

∨ 위 내용을 잘 숙지하여 검진 전 준비를 완료해 주세요!
추가 문의사항은 '체킷 근로자 포털' 채팅방을 이용해 주시기 바랍니다.
알림톡 외 추가 문의는 체킷 근로자 포털 채팅방을 이용해 주세요.`;
}

/**
 * 1:1 알림톡 발송용 (수동/트리거)
 */
exports.sendAlimtalk = functions.firestore
  .document('messages/{messageId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const workerDocId = data.workerDocId;

    if (!workerDocId) return null;

    try {
      console.log('STEP 1: Fetching worker doc for ID:', workerDocId);
      // 1. 근로자 정보 가져오기
      const workerDoc = await db.collection('workers').doc(workerDocId).get();
      if (!workerDoc.exists) {
        console.error('STEP 1 ERROR: Worker doc not found in workers collection');
        return null;
      }
      
      const workerData = workerDoc.data();
      console.log('STEP 2: Worker data found:', JSON.stringify(workerData));
      const phoneNumber = (workerData.phone || workerData.phoneNumber || workerData['연락처'] || '').replace(/-/g, '');
      console.log('STEP 3: Normalized phone number:', phoneNumber);

      if (!phoneNumber) {
        console.error('STEP 3 ERROR: Phone number is empty for worker');
        return null;
      }

      // 2. 메시지 데이터 구성 (v5 SDK 포맷)
      let message = {};
      
      if (data.type === 'booking_guide') {
        const customNotice = data.customContent || '검진 예약 가이드 및 준비사항을 확인해 주세요.';
        const nameVal = workerData.name || '고객';
        const dDayVal = '가이드';

        message = {
          to: phoneNumber,
          from: '01022097951',
          type: 'ATA',
          text: getAlimtalkTemplateText(nameVal, dDayVal, customNotice),
          kakaoOptions: {
            templateId: 'KA01TP260401123529786bxLeVETmEai',
            pfId: 'KA01PF260401123510015EukHvlIDzQP',
            variables: {
              "#{성함}": nameVal,
              "#{디데이}": dDayVal,
              "#{안내내용예시}": customNotice
            }
          }
        };
      } else if (data.type === 'text') {
        message = {
          to: phoneNumber,
          from: '01022097951',
          type: 'SMS',
          text: data.text || '[체킷] 메시지가 도착했습니다.'
        };
      } else {
        return null;
      }

      // 3. 메시지 발송
      console.log('Attempting v5 send with message:', JSON.stringify(message, null, 2));
      const result = await messageService.sendOne(message);
      console.log('Solapi v5 Result:', JSON.stringify(result, null, 2));
      
      return snap.ref.update({
        status: 'sent',
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        solapiResult: result
      });

    } catch (error) {
      console.error('Solapi v5 Error:', error);
      return snap.ref.update({
        status: 'error',
        error: error.message,
        errorDetail: error.data || error.response || 'No additional data'
      });
    }
  });

/**
 * 매일 오전 7시 자동 예약 발송 스케줄러
 */
exports.scheduledAlimtalk = functions.pubsub
  .schedule('0 7 * * *')
  .timeZone('Asia/Seoul')
  .onRun(async (context) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      const snap = await db.collection('workers').where('reservedDate', '!=', null).get();
      const targetDays = [7, 3, 1, 0];
      const messages = [];

      snap.forEach(doc => {
        const worker = doc.data();
        if (!worker.reservedDate) return;
        
        const reservedDate = new Date(worker.reservedDate);
        reservedDate.setHours(0, 0, 0, 0);
        const dDay = Math.ceil((reservedDate - today) / (1000 * 60 * 60 * 24));

        if (targetDays.includes(dDay)) {
          const phoneNumber = (worker.phone || worker.phoneNumber || worker['연락처'] || '').replace(/-/g, '');
          if (phoneNumber.length < 10) return;

          const dDayVal = dDay === 0 ? '당일' : dDay.toString();
          const customNotice = dDay === 0 
            ? '오늘은 건강검진일입니다. 잊지 말고 방문해 주세요!' 
            : `검진이 ${dDay}일 앞으로 다가왔습니다. 준비 사항을 확인해 주세요.`;
          const nameVal = worker.name || '고객';

          messages.push({
            to: phoneNumber,
            from: '01022097951',
            type: 'ATA',
            text: getAlimtalkTemplateText(nameVal, dDayVal, customNotice),
            kakaoOptions: {
              templateId: 'KA01TP260401123529786bxLeVETmEai',
              pfId: 'KA01PF260401123510015EukHvlIDzQP',
              variables: {
                "#{성함}": nameVal,
                "#{디데이}": dDayVal,
                "#{안내내용예시}": customNotice
              }
            }
          });
        }
      });

      if (messages.length > 0) {
        const result = await messageService.sendMany(messages);
        console.log(`Auto Send Done. Total: ${messages.length}`, result);
      }
      return null;
    } catch (error) {
      console.error('Scheduled Task Error:', error);
      return null;
    }
  });

/**
 * 알림톡/이메일 예약 등록 시 즉시 "등록 확인" 발송 트리거
 */
exports.sendImmediateNotificationConfirmation = functions.firestore
  .document('scheduled_notifications/{notifId}')
  .onWrite(async (change, context) => {
    // Handle deletions
    if (!change.after.exists) return null;

    const beforeData = change.before.exists ? change.before.data() : null;
    const data = change.after.data();

    // Optimization: If this was an update, only proceed if contact details or dates changed
    if (beforeData) {
      const isSameContact = beforeData.contactValue === data.contactValue;
      const isSameType = beforeData.contactType === data.contactType;
      const isSameDate = beforeData.reservedDate === data.reservedDate;
      const isSameHospital = beforeData.hospitalName === data.hospitalName;

      // If only something trivial (like 'suppliesStatus') changed, do NOT re-fire confirmation spam
      if (isSameContact && isSameType && isSameDate && isSameHospital) {
        console.log('Immediate confirmation skipped: core fields unchanged');
        return null;
      }
    }

    if (!data.contactValue || !data.contactType) return null;

    try {
      const contactValue = data.contactValue.replace(/-/g, '');
      const userName = data.name || '고객';
      const hospitalName = data.hospitalName || '선택하신 의료기관';
      const checkupDate = data.reservedDate || '미정';

      const noticeContent = `귀하의 건강검진 사전 알림 예약이 정상 접수되었습니다.\n\n• 기관: ${hospitalName}\n• 예정일: ${checkupDate}\n\n지정된 일정(7, 3, 2, 1일 전)에 맞춰 주의사항 안내를 전달드리겠습니다.`;

      if (data.contactType === 'alimtalk') {
        const immediateNotice = `검진 알림 예약이 접수되었습니다. 기관: ${hospitalName}, 예정일: ${checkupDate}`;
        const dDayVal = '확인';
        
        // 즉시 알림톡 발송
        await messageService.sendOne({
          to: contactValue,
          from: '01022097951',
          type: 'ATA',
          text: getAlimtalkTemplateText(userName, dDayVal, immediateNotice),
          kakaoOptions: {
            templateId: 'KA01TP260401123529786bxLeVETmEai',
            pfId: 'KA01PF260401123510015EukHvlIDzQP',
            variables: {
              "#{성함}": userName,
              "#{디데이}": dDayVal,
              "#{안내내용예시}": immediateNotice
            }
          }
        });
        console.log('Immediate Alimtalk Sent');
      } else if (data.contactType === 'email') {
        // 즉시 이메일 발송
        const emailResponse = await resend.emails.send({
          from: '체킷(Checkit) <no-reply@checkit082.kr>',
          to: data.contactValue,
          subject: `[체킷] 건강검진 안내 예약이 접수되었습니다.`,
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: sans-serif; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
              <div style="background: #3b82f6; color: white; padding: 24px; text-align: center;">
                <h2 style="margin: 0; font-size: 20px;">알림 예약 접수 완료</h2>
              </div>
              <div style="padding: 30px; color: #334155; line-height: 1.6;">
                <p>안녕하세요, <strong>${userName}</strong>님!</p>
                <p>입력하신 정보에 맞춰 건강검진 맞춤형 알림 시스템 등록이 완료되었습니다.</p>
                <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <p style="margin: 5px 0;">🏢 <strong>검진 기관:</strong> ${hospitalName}</p>
                  <p style="margin: 5px 0;">📅 <strong>검진 예정일:</strong> ${checkupDate}</p>
                </div>
                <p style="font-weight: 600; color: #2563eb;">💡 앞으로의 안내 일정</p>
                <ul style="padding-left: 20px; color: #475569;">
                  <li>검진 7일 전, 3일 전, 2일 전, 1일 전 (각 시점별 주의사항)</li>
                  <li>검진 당일 안내</li>
                </ul>
                <p style="text-align: center; margin-top: 30px; color: #64748b; font-size: 13px;">편안한 검진 되시길 응원합니다. 감사합니다!</p>
              </div>
            </div>
          `
        });
        console.log('Immediate Email Attempt Complete. Recipient:', data.contactValue);
        console.log('Resend API Response:', JSON.stringify(emailResponse));
      }

      return null;
    } catch (error) {
      console.error('Immediate Notification Error:', error);
      return null;
    }
  });

/**
 * B2C 챗봇 전용 매일 예약 발송 스케줄러
 * 7일전, 3일전, 2일전, 1일전, 당일 지원
 */
exports.scheduledB2CNotifications = functions.pubsub
  .schedule('10 7 * * *') // 7:10 AM to avoid collision
  .timeZone('Asia/Seoul')
  .onRun(async (context) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      const snap = await db.collection('scheduled_notifications').where('status', '==', 'pending').get();
      const targetDays = [14, 7, 3, 2, 1, 0];
      const solapiMessages = [];
      const resendMessages = [];

      snap.forEach(doc => {
        const item = doc.data();
        if (!item.reservedDate || !item.contactValue) return;
        
        // [USER REQUEST] '기타' 병원은 자동 발송에서 제외 (마스터 페이지 수기 발송용)
        if (item.hospitalName === '기타') return;

        const reservedDate = new Date(item.reservedDate);
        reservedDate.setHours(0, 0, 0, 0);
        const dDay = Math.ceil((reservedDate - today) / (1000 * 60 * 60 * 24));

        if (targetDays.includes(dDay)) {
          const formattedContact = item.contactValue.replace(/-/g, '');
          const isKMI = (item.hospitalName || '').includes('KMI') || (item.hospitalName || '').includes('한국의학연구소');
          
          let customNotice = '';
          if (isKMI) {
            // KMI Specific Instructions Verbatim
            if (dDay === 14) {
              customNotice = `[D-14] GLP-1 수용체 작용제(위고비, 마운자로, 오젬픽 등 비만/당뇨 치료제) 복용자는 검진일 2주 전부터 복용을 중단해야 합니다. 반드시 주치의와 상의하세요.`;
            } else if (dDay === 7) {
              customNotice = `[D-7] 아스피린, 와파린, 플라빅스 등 항혈소판제/항응고제를 복용 중인 분은 출혈 위험이 있으니 반드시 처방 의사와 상의하여 약 1주일 중단하시기 바랍니다.`;
            } else if (dDay === 3) {
              customNotice = `[D-3] 정확한 검사를 위해 식사 조절을 시작하세요. 잡곡밥, 현미밥, 김치, 해조류(김, 미역), 씨 있는 과일 등은 소화가 안 되어 내시경 방해가 되므로 금지합니다.`;
            } else if (dDay === 2) {
              customNotice = `[D-2] 가벼운 백색 위주 식사를 하세요. 대장내시경 예약자의 경우 받으신 복용 안내문에 따라 준비물(정결제) 및 복용법을 한 번 더 숙지해 주십시오.`;
            } else if (dDay === 1) {
              customNotice = `[D-1] 검사 전 8~12시간 금식 필수! 오전 예약자는 전날 밤 8시부터, 오후 예약자는 전날 밤 12시부터 물, 껌, 사탕, 담배 포함 절대 금식하시고 편안한 숙면 취하세요.`;
            } else if (dDay === 0) {
              customNotice = `[D-Day] 오늘은 건강검진일입니다. 사진과 주민번호가 기재된 '실물 신분증'을 반드시 지참하시고 예약 시간 15분 전까지 KMI 한국의학연구소에 내원해주십시오.`;
            }
          } else {
            // Standard Guidelines
            if (dDay === 14) {
              return; // No notification for 14 days if standard
            } else if (dDay === 7) {
              customNotice = `[D-7] 복용 중인 약물(항응고제, 아스피린 등)이 있다면 주치의와 상담하여 중단 여부를 확인하시기 바랍니다.`;
            } else if (dDay === 3) {
              customNotice = `[D-3] 검사 전 식단 조절 시기입니다. 씨 있는 과일, 해조류, 잡곡 등 소화가 더딘 음식은 피해주시고 가급적 흰쌀밥이나 죽을 섭취해 주세요.`;
            } else if (dDay === 2) {
              customNotice = `[D-2] 대장내시경을 예약하신 경우, 받으신 안내문을 정독하여 정결제 복용 방법 및 주의사항을 미리 확인해주십시오.`;
            } else if (dDay === 1) {
              customNotice = `[D-1] 검진 전날은 오후 8시 이후 물을 포함하여 완벽한 금식이 필요합니다. 음주와 무리한 활동은 피하고 일찍 휴식하시기 바랍니다.`;
            } else if (dDay === 0) {
              customNotice = `[D-Day] 오늘은 예약된 건강검진일입니다. 아침 식사는 거르시고 '신분증'을 지참하여 예약 시간 전까지 ${item.hospitalName || '의료기관'}에 내원해 주십시오.`;
            }
          }
          
          if (!customNotice) return; // Skip if somehow notice is empty (e.g., D-14 default)

          if (item.contactType === 'alimtalk') {
            const dDayVal = dDay === 0 ? '당일' : `${dDay}일전`;
            const nameVal = item.name || '고객';
            
            solapiMessages.push({
              to: formattedContact,
              from: '01022097951',
              type: 'ATA',
              text: getAlimtalkTemplateText(nameVal, dDayVal, customNotice),
              kakaoOptions: {
                templateId: 'KA01TP260401123529786bxLeVETmEai',
                pfId: 'KA01PF260401123510015EukHvlIDzQP',
                variables: {
                  "#{성함}": nameVal,
                  "#{디데이}": dDayVal,
                  "#{안내내용예시}": customNotice
                }
              }
            });
          } else if (item.contactType === 'email') {
            const subjectDay = dDay === 0 ? '당일' : `${dDay}일 전`;
            resendMessages.push({
              from: '체킷(Checkit) <no-reply@checkit082.kr>',
              to: item.contactValue,
              subject: `[체킷] 건강검진 ${subjectDay} 안내 드립니다. (${item.name || '고객'}님)`,
              html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: sans-serif; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
                  <div style="background: #10b981; color: white; padding: 24px; text-align: center;">
                    <h2 style="margin: 0; font-size: 20px;">건강검진 준비 안내</h2>
                  </div>
                  <div style="padding: 30px; color: #334155; line-height: 1.6;">
                    <p style="font-size: 16px;">안녕하세요, <strong>${item.name || '고객'}</strong>님!</p>
                    <p>예약하신 건강검진 일정이 다가오고 있어 안내 내용을 전달드립니다.</p>
                    <div style="background: #f8fafc; border-left: 4px solid #10b981; padding: 20px; border-radius: 6px; margin: 25px 0;">
                      <p style="margin: 0 0 10px 0; font-weight: 700; color: #0f172a;">📅 검진 기관: ${item.hospitalName}</p>
                      <p style="margin: 0; font-weight: 700; color: #0f172a;">⏰ 시점: 검진 ${subjectDay}</p>
                    </div>
                    <div style="background: #fffbeb; border: 1px solid #fef3c7; color: #92400e; padding: 20px; border-radius: 8px; font-size: 15px; font-weight: 600;">
                      💡 필수 유의사항<br/>
                      <span style="color: #1e293b; display: block; margin-top: 8px; font-weight: 500;">${customNotice}</span>
                    </div>
                    <p style="margin-top: 30px; font-size: 14px; color: #64748b; text-align: center;">
                      본 메일은 체킷(Checkit) 스마트 알림 시스템에 의해 자동 발송되었습니다.<br>편안한 검진 되시길 바랍니다.
                    </p>
                  </div>
                </div>
              `
            });
          }
        }

        // Optional: If the date has passed, mark it as completed
        if (reservedDate < today) {
          db.collection('scheduled_notifications').doc(doc.id).update({ status: 'completed' });
        }
      });

      // Send Alimtalk Batch
      if (solapiMessages.length > 0) {
        const result = await messageService.sendMany(solapiMessages);
        console.log(`B2C Auto Send Done. Total Alimtalks: ${solapiMessages.length}`, result);
      }

      // Send Email Batch
      if (resendMessages.length > 0) {
        const emailResult = await resend.batch.send(resendMessages);
        console.log(`B2C Email Auto Send Done. Total Emails: ${resendMessages.length}`, emailResult);
      }

      return null;
    } catch (error) {
      console.error('B2C Scheduled Task Error:', error);
      return null;
    }
  });

/**
 * Disease Code Lookup via KOICD (Korean Classification of Diseases)
 * Bypasses CORS issues by running on the server side.
 */
const axios = require('axios');
const cheerio = require('cheerio');

exports.analyzeDiseaseCodes = functions.https.onCall(async (data, context) => {
  const query = data.query;
  if (!query) throw new functions.https.HttpsError('invalid-argument', 'Query is required');

  try {
    const url = `https://www.koicd.kr/sch/searchTotal.do?keyword=${encodeURIComponent(query)}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    const results = [];
    $('.searchResult tr').each((i, el) => {
      const cells = $(el).find('td');
      if (cells.length >= 2) {
        const name = $(cells[0]).text().trim();
        const code = $(cells[1]).text().trim();
        if (name && code) {
          results.push({ name, code });
        }
      }
    });

    return { results: results.slice(0, 10) };
  } catch (error) {
    console.error('KOICD Lookup Error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to fetch disease codes');
  }
});


