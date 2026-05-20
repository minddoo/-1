const fs = require('fs');
const path = require('path');
const mainJsPath = path.join(__dirname, 'main.js');
let js = fs.readFileSync(mainJsPath, 'utf8');

// ── FIX 1: Remove the duplicate DOMContentLoaded language selector block ──────
// The block starting at "// Language Selection Logic\ndocument.addEventListener('DOMContentLoaded', () => {"
// conflicts with the earlier langSelector init at script level (line ~1718).
const dupLangBlockStart = `\r\n// Language Selection Logic\r\ndocument.addEventListener('DOMContentLoaded', () => {\r\n    const currentLang = document.querySelector('.current-lang');\r\n    const langDropdown = document.querySelector('.lang-dropdown');\r\n    const langOptions = document.querySelectorAll('.lang-option');\r\n    const currentLangText = document.getElementById('current-lang');`;
const dupLangBlockEnd = `});\r\n\r\n// Translation Optimization`;

const dupLangBlockStartLF = `\n// Language Selection Logic\ndocument.addEventListener('DOMContentLoaded', () => {\n    const currentLang = document.querySelector('.current-lang');\n    const langDropdown = document.querySelector('.lang-dropdown');\n    const langOptions = document.querySelectorAll('.lang-option');\n    const currentLangText = document.getElementById('current-lang');`;

let fixCount = 0;

if (js.includes(dupLangBlockStart)) {
    // Find the whole block and remove it
    const startIdx = js.indexOf(dupLangBlockStart);
    const endSearchStr = `});\n\n// Translation Optimization`;
    const endSearchStrCRLF = `});\r\n\r\n// Translation Optimization`;
    let endIdx = js.indexOf(endSearchStrCRLF, startIdx);
    if (endIdx === -1) endIdx = js.indexOf(endSearchStr, startIdx);
    if (endIdx !== -1) {
        // Remove from startIdx to just before "// Translation Optimization"
        const closingBraceEndIdx = endIdx + 4; // length of "});\r\n"
        js = js.slice(0, startIdx) + '\r\n' + js.slice(closingBraceEndIdx);
        console.log('[FIX 1] Duplicate lang selector DOMContentLoaded block removed (CRLF)');
        fixCount++;
    }
} else if (js.includes(dupLangBlockStartLF)) {
    const startIdx = js.indexOf(dupLangBlockStartLF);
    const endSearchStr = `});\n\n// Translation Optimization`;
    const endIdx = js.indexOf(endSearchStr, startIdx);
    if (endIdx !== -1) {
        js = js.slice(0, startIdx) + '\n' + js.slice(endIdx + 3);
        console.log('[FIX 1] Duplicate lang selector DOMContentLoaded block removed (LF)');
        fixCount++;
    }
} else {
    console.log('[FIX 1] WARNING: Duplicate lang block not found. Manual check needed.');
}

// ── FIX 2: In showView('mypage'), always call subscribeToUserActiveState ───────
// After initDashboard() call, add an unconditional call to check/re-subscribe.
// Target: the existing block inside showView for mypage
const showViewTarget_CRLF = `        if (typeof initDashboard === 'function') {\r\n            initDashboard();\r\n        }\r\n    } else if (viewName === 'home') {`;
const showViewTarget_LF   = `        if (typeof initDashboard === 'function') {\n            initDashboard();\n        }\n    } else if (viewName === 'home') {`;
const showViewReplacement = `        if (typeof initDashboard === 'function') {
            initDashboard();
        }
        // Always re-subscribe to ensure self-test/step-1 visibility is correct
        // (handles re-navigation to mypage without full re-init)
        if (typeof window.subscribeToUserActiveState === 'function') {
            const currentEmail = localStorage.getItem('userEmail') || '';
            const alreadySubmitted = localStorage.getItem('consultationData_' + currentEmail);
            if (!alreadySubmitted) {
                window.subscribeToUserActiveState(currentEmail);
            }
        }
    } else if (viewName === 'home') {`;

if (js.includes(showViewTarget_CRLF)) {
    js = js.replace(showViewTarget_CRLF, showViewReplacement);
    console.log('[FIX 2] showView mypage block updated (CRLF)');
    fixCount++;
} else if (js.includes(showViewTarget_LF)) {
    js = js.replace(showViewTarget_LF, showViewReplacement);
    console.log('[FIX 2] showView mypage block updated (LF)');
    fixCount++;
} else {
    console.log('[FIX 2] WARNING: showView mypage target not found.');
}

fs.writeFileSync(mainJsPath, js, 'utf8');
console.log(`\nDone. Applied ${fixCount}/2 fixes to main.js.`);
