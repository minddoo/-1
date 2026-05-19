const fs = require('fs');
const filePath = 'main.js';
let content = fs.readFileSync(filePath, 'utf8');

let newContent = content.replace("if (phaseTitle) phaseTitle.innerText = '병원 예약 및 검진 전 주의사항 안내';", 
"if (phaseTitle) phaseTitle.innerText = phase2Trans[document.documentElement.lang || 'en'] || phase2Trans['en'];");
newContent = newContent.replace("if (phaseTitle) phaseTitle.innerText = '병원 및 프로그램 선정';", 
"if (phaseTitle) phaseTitle.innerText = phase1Trans[document.documentElement.lang || 'en'] || phase1Trans['en'];");

const insertStr = `
        const phase1Trans = {
            'ko': '병원 및 프로그램 선정', 'en': 'Hospital & Program Selection', 'ja': '病院及びプログラム選定',
            'zh-CN': '医院及项目选择', 'vi': 'Lựa chọn Bệnh viện & Chương trình', 'th': 'การเลือกโรงพยาบาลและโปรแกรม', 'ru': 'Выбор клиники и программы'
        };
        const phase2Trans = {
            'ko': '병원 예약 및 검진 전 주의사항 안내', 'en': 'Guide to Hospital Appointments & Precautions', 'ja': '病院予約及び検診前の注意事項案内',
            'zh-CN': '医院预约及体检前注意事项指南', 'vi': 'Hướng dẫn Đặt lịch & Lưu ý Trước khi Khám', 'th': 'คำแนะนำการจองโรงพยาบาลและข้อควรระวังก่อนตรวจ', 'ru': 'Руководство по записи и меры предосторожности'
        };
`;
newContent = newContent.replace("if (index >= 6) {", insertStr + "        if (index >= 6) {");

fs.writeFileSync(filePath, newContent);
console.log('Fixed main.js');
