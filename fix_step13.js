const fs = require('fs');
const filePath = 'main.js';
let content = fs.readFileSync(filePath, 'utf8');

const translations = {
    'ko': "'검진 결과 원본 번역 및<br><span class=\"highlight\">AI 기반 질병 코드 분석</span>'",
    'en': "'Original Document Translation &<br><span class=\"highlight\">AI Disease Code Analysis</span>'",
    'ja': "'健診結果の原本翻訳および<br><span class=\"highlight\">AIベースの疾患コード分析</span>'",
    'zh-CN': "'体检结果原件翻译及<br><span class=\"highlight\">基于AI的疾病代码分析</span>'",
    'vi': "'Dịch Bản gốc Kết quả &<br><span class=\"highlight\">Phân tích Mã Bệnh bằng AI</span>'",
    'th': "'แปลต้นฉบับผลการตรวจและ<br><span class=\"highlight\">วิเคราะห์รหัสโรคด้วย AI</span>'",
    'ru': "'Перевод оригинала результатов и<br><span class=\"highlight\">ИИ-анализ кодов заболеваний</span>'"
};

// Find the workflowTranslations object.
// We will look for each array end `]` and insert our new string.
// However, there are 7 languages, so we need to be careful.

const langs = ['ko', 'en', 'ja', 'zh-CN', 'vi', 'th', 'ru'];

for (const lang of langs) {
    // Find the language block
    const blockStartRegex = new RegExp(`'${lang}':\\s*\\{[\\s\\S]*?steps:\\s*\\[`);
    const match = content.match(blockStartRegex);
    if (match) {
        let blockStartIndex = match.index + match[0].length;
        // Find the closing bracket of the steps array
        let blockEndIndex = content.indexOf(']', blockStartIndex);
        
        let existingSteps = content.substring(blockStartIndex, blockEndIndex);
        
        // Count how many steps exist by counting commas or strings.
        // If it doesn't already have the 13th (which means index 12), we add it.
        // Usually, the 12th step is "예약 완료 및..."
        
        // Let's just append it before the `]` if it's not already there.
        if (!existingSteps.includes(translations[lang])) {
            let lastItemEnd = existingSteps.lastIndexOf("'");
            if (lastItemEnd !== -1) {
                let updatedSteps = existingSteps.substring(0, lastItemEnd + 1) + ",\\n            " + translations[lang] + "\\n        ";
                content = content.substring(0, blockStartIndex) + updatedSteps + content.substring(blockEndIndex);
            }
        }
    }
}

fs.writeFileSync(filePath, content);
console.log('Fixed main.js translations for step 13');
