const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { SolapiMessageService } = require('solapi');

admin.initializeApp();
const db = admin.firestore();

// 솔라피 서비스 초기화 (v5 기준)
const messageService = new SolapiMessageService(
  'NCS3LR13SE2MENQS', 
  'HB0SBNAPBBULLWL3EXPTH6QPQYKKYPGD'
);

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
        message = {
          to: phoneNumber,
          from: '01022097951',
          type: 'ATA',
          templateId: 'KA01TP260401123529786bxLeVETmEai',
          pfId: 'KA01PF260401123510015EukHvlIDzQP',
          variables: {
            "#{성함}": workerData.name || '고객',
            "#{디데이}": '가이드',
            "#{안내내용예시}": data.customContent || '검진 예약 가이드 및 준비사항을 확인해 주세요.'
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

          messages.push({
            to: phoneNumber,
            from: '01022097951',
            type: 'ATA',
            templateId: 'KA01TP260401123529786bxLeVETmEai',
            pfId: 'KA01PF260401123510015EukHvlIDzQP',
            variables: {
              "#{성함}": worker.name || '고객',
              "#{디데이}": dDay === 0 ? '당일' : dDay.toString(),
              "#{안내내용예시}": dDay === 0 
                ? '오늘은 건강검진일입니다. 잊지 말고 방문해 주세요!' 
                : `검진이 ${dDay}일 앞으로 다가왔습니다. 준비 사항을 확인해 주세요.`
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
      const targetDays = [7, 3, 2, 1, 0];
      const solapiMessages = [];

      snap.forEach(doc => {
        const item = doc.data();
        if (!item.reservedDate || !item.contactValue) return;

        const reservedDate = new Date(item.reservedDate);
        reservedDate.setHours(0, 0, 0, 0);
        const dDay = Math.ceil((reservedDate - today) / (1000 * 60 * 60 * 24));

        if (targetDays.includes(dDay)) {
          const formattedContact = item.contactValue.replace(/-/g, '');
          
          // Generate dynamic precautions guidance text
          let customNotice = '';
          if (dDay === 7) {
            customNotice = `[검진 7일 전] 복용 중인 약물(항응고제, 아스피린 등)이 있다면 주치의와 상담하여 중단 여부를 확인해주세요.`;
          } else if (dDay === 3) {
            customNotice = `[검진 3일 전] 정확한 검사를 위해 오늘부터 식사 조절(씨 있는 과일, 잡곡밥, 해조류 금지)을 시작해주세요.`;
          } else if (dDay === 2) {
            customNotice = `[검진 2일 전] 가벼운 식사를 하시고, 내시경이 예약되어 있다면 동봉된 안내문의 복용법을 다시 한 번 확인해주세요.`;
          } else if (dDay === 1) {
            customNotice = `[검진 1일 전 - 중요!] 오후 9시 이후부터는 반드시 금식(물 포함 모든 음식 금지)하셔야 합니다. 숙면을 취해주세요.`;
          } else if (dDay === 0) {
            customNotice = `[검진 당일] 오늘은 예약된 건강검진일입니다. 아침 식사는 거르시고, 예약 시간 15분 전까지 ${item.hospitalName}에 내원해주세요.`;
          }

          if (item.contactType === 'alimtalk') {
            solapiMessages.push({
              to: formattedContact,
              from: '01022097951',
              type: 'ATA',
              templateId: 'KA01TP260401123529786bxLeVETmEai',
              pfId: 'KA01PF260401123510015EukHvlIDzQP',
              variables: {
                "#{성함}": item.name || '고객',
                "#{디데이}": dDay === 0 ? '당일' : `${dDay}일전`,
                "#{안내내용예시}": customNotice
              }
            });
          } else if (item.contactType === 'whatsapp') {
            // TO BE INTEGRATED: API call for WhatsApp Gateway (e.g., Twilio, Meta Cloud API)
            console.log(`[STUB] Sending WhatsApp to ${formattedContact}: ${customNotice}`);
            // Temporary Fallback to SMS via Solapi if activated, or just logging.
          } else if (item.contactType === 'email') {
            // TO BE INTEGRATED: API call for Email Gateway (e.g., Nodemailer/SendGrid)
            console.log(`[STUB] Sending Email to ${item.contactValue}: ${customNotice}`);
          }
        }

        // Optional: If the date has passed, mark it as completed
        if (reservedDate < today) {
          db.collection('scheduled_notifications').doc(doc.id).update({ status: 'completed' });
        }
      });

      if (solapiMessages.length > 0) {
        const result = await messageService.sendMany(solapiMessages);
        console.log(`B2C Auto Send Done. Total Alimtalks: ${solapiMessages.length}`, result);
      }

      return null;
    } catch (error) {
      console.error('B2C Scheduled Task Error:', error);
      return null;
    }
  });

