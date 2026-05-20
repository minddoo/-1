const fs = require('fs');

// --- 1. Update main.js ---
let mainJs = fs.readFileSync('main.js', 'utf8');

// Replace the previous hook block with our improved iframe-friendly hook
const newHook = `// Hook localStorage.getItem to support impersonation for Master viewing customer My Page (Iframe & Redirect friendly)
(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const impEmail = urlParams.get('impersonate_email');
    const impName = urlParams.get('impersonate_name');

    if (impEmail) {
        window.impersonatedUserEmail = impEmail;
        window.impersonatedUserName = impName || 'Customer';
    } else {
        // Fallback to localStorage (for backward compatibility if redirecting)
        window.impersonatedUserEmail = localStorage.getItem('impersonate_email');
        window.impersonatedUserName = localStorage.getItem('impersonate_name');
    }

    const originalGetItem = localStorage.getItem;
    localStorage.getItem = function(key) {
        if (key === 'userEmail' && window.impersonatedUserEmail) {
            return window.impersonatedUserEmail;
        }
        if (key === 'userName' && window.impersonatedUserName) {
            return window.impersonatedUserName;
        }
        if (key === 'isLoggedIn' && window.impersonatedUserEmail) {
            return 'true';
        }
        return originalGetItem.call(localStorage, key);
    };

    // Impersonation exit listener & banner rendering
    document.addEventListener('DOMContentLoaded', () => {
        if (window.impersonatedUserEmail) {
            const isIframe = window.self !== window.top;
            const banner = document.createElement('div');
            banner.id = 'master-impersonate-banner';
            banner.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; background: #10b981; color: white; text-align: center; padding: 10px; z-index: 100000; font-weight: bold; display: flex; justify-content: center; align-items: center; gap: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); font-family: 'Pretendard', sans-serif; font-size: 0.9rem;";
            
            if (isIframe) {
                // If running in an iframe inside the master dashboard
                banner.innerHTML = \`<span>🔧 [실시간 모니터링] <strong>\${window.impersonatedUserName} (\${window.impersonatedUserEmail})</strong> 고객의 마이페이지 실시간 화면입니다.</span>\`;
            } else {
                // If running as a standalone redirect page
                banner.innerHTML = \`
                    <span>🔧 [마스터 모드] <strong>\${window.impersonatedUserName} (\${window.impersonatedUserEmail})</strong> 고객의 마이페이지를 조회 중입니다.</span>
                    <button onclick="exitImpersonate()" style="background: white; color: #10b981; border: none; padding: 6px 14px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-size: 0.85rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">대시보드로 돌아가기</button>
                \`;
            }
            
            document.body.appendChild(banner);
            document.body.style.paddingTop = '40px'; // Push content down

            // Expose exitImpersonate function globally
            window.exitImpersonate = function() {
                localStorage.removeItem('impersonate_email');
                localStorage.removeItem('impersonate_name');
                window.location.href = 'master_dashboard.html';
            };

            // Auto-show My Page view directly
            setTimeout(() => {
                if (typeof window.showView === 'function') {
                    window.showView('mypage');
                }
            }, 300);
        }
    });
})();`;

// Find the start and end of the previous hook block
const hookStart = '// Hook localStorage.getItem to support impersonation';
const hookEnd = '// Firebase Initialization';

const startIdx = mainJs.indexOf(hookStart);
const endIdx = mainJs.indexOf(hookEnd);

if (startIdx !== -1 && endIdx !== -1) {
    mainJs = mainJs.slice(0, startIdx) + newHook + '\n\n' + mainJs.slice(endIdx);
    fs.writeFileSync('main.js', mainJs);
    console.log('Successfully updated main.js with iframe-friendly hook.');
} else {
    console.error('Failed to locate hook indices in main.js');
}


// --- 2. Update master_dashboard.html ---
let dashboard = fs.readFileSync('master_dashboard.html', 'utf8');

// A. Insert preview modal HTML container right before the script block or </body>
const previewModalHtml = `
    <!-- Customer My Page Preview Modal -->
    <div id="mypage-preview-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:99999; justify-content:center; align-items:center; backdrop-filter:blur(5px);">
        <div style="background:white; width:90%; height:90%; border-radius:24px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25); border:1px solid rgba(255,255,255,0.2);">
            <div style="padding:15px 25px; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center; background:#f8fafc;">
                <h3 id="preview-modal-title" style="margin:0; font-size:1.1rem; font-weight:700; color:#1e293b; font-family: 'Pretendard', sans-serif;">고객 마이페이지 실시간 조회</h3>
                <button onclick="closeMypagePreview()" style="background:rgba(0,0,0,0.05); border:none; width:36px; height:36px; border-radius:50%; cursor:pointer; display:flex; justify-content:center; align-items:center; font-size:1.1rem; color:#475569; transition:all 0.2s;">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div style="flex:1; width:100%; height:100%; position:relative;">
                <iframe id="mypage-preview-iframe" src="" style="width:100%; height:100%; border:none; background:#f8fafc;"></iframe>
            </div>
        </div>
    </div>
`;

// Insert the preview modal HTML right before the end of the body
dashboard = dashboard.replace('</body>', previewModalHtml + '\n</body>');

// B. Update viewCustomerMypage function in master_dashboard.html
const oldViewFunc = `        // Action: View Customer My Page
        function viewCustomerMypage(email, name) {
            localStorage.setItem('impersonate_email', email);
            localStorage.setItem('impersonate_name', name);
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'index.html?view=mypage';
        }`;

const newViewFunc = `        // Action: View Customer My Page
        function viewCustomerMypage(email, name) {
            const iframe = document.getElementById('mypage-preview-iframe');
            const title = document.getElementById('preview-modal-title');
            const modal = document.getElementById('mypage-preview-modal');
            
            if (iframe && title && modal) {
                title.innerHTML = \`🔧 [실시간 조회] <strong>\${name} (\${email})</strong> 고객의 마이페이지\`;
                iframe.src = \`index.html?view=mypage&impersonate_email=\${encodeURIComponent(email)}&impersonate_name=\${encodeURIComponent(name)}\`;
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // prevent dashboard scrolling
            }
        }
        
        function closeMypagePreview() {
            const iframe = document.getElementById('mypage-preview-iframe');
            const modal = document.getElementById('mypage-preview-modal');
            if (iframe) iframe.src = '';
            if (modal) modal.style.display = 'none';
            document.body.style.overflow = ''; // restore dashboard scrolling
        }`;

dashboard = dashboard.replace(oldViewFunc, newViewFunc);

fs.writeFileSync('master_dashboard.html', dashboard);
console.log('Successfully updated master_dashboard.html with iframe modal integration.');
