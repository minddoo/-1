// Sticky Header effect
const header = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Reveal Animations on Scroll
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));

// Language Switcher Logic
const langSelector = document.querySelector('.language-selector');
const langDropdown = document.querySelector('.lang-dropdown');
const currentLangText = document.getElementById('current-lang');

if (langSelector) {
    langSelector.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('show');
        
        // If user clicks the main button, also trigger translation for the current selection
        const savedLang = localStorage.getItem('preferred-lang') || 'en';
        if (savedLang !== 'en') {
            changeLanguage(savedLang);
        }
    });

    document.addEventListener('click', () => {
        langDropdown.classList.remove('show');
    });

    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', function() {
            const langCode = this.getAttribute('data-lang');
            const langName = this.innerText;
            
            if (currentLangText) currentLangText.innerText = langName;
            changeLanguage(langCode);
            
            localStorage.setItem('preferred-lang', langCode);
            localStorage.setItem('preferred-lang-name', langName);
        });
    });
}

// Cookie Helpers for Translation
// Legal Translations Dictionary
const legalTranslations = {
    'ko': {
        title: '개인정보 수집 및 이용 동의 (필수)',
        content: `<strong>1. 수집 및 이용 목적</strong><br>체킷 글로벌은 사용자가 자율적으로 선택한 의료기관과의 행정적 예약 지원, 1:1 통번역 서포트, 그리고 결과지 수신 및 관리 지원만을 목적으로 정보를 수집합니다.<br><br><strong>2. 수집 항목 (과거 이력 제외)</strong><br>성함, 생년월일(6자리), 연락처, 이메일, 한국 내 거주 주소, 현재 선택한 검진 항목 및 병원 정보, 병원 수령 결과지. <span style="color:var(--primary); font-weight:800;">※ 체킷은 사용자의 과거 검진 이력을 절대 수집하거나 요구하지 않습니다.</span><br><br><strong>3. 의료행위 및 유치 배제 고지</strong><br>체킷은 의료법상 의료기관이 아니며 진단, 처방, 시술 등 일체의 의료행위를 하지 않습니다. 또한 영리 목적으로 특정 병원을 추천하거나 유도하지 않으며, 모든 병원 및 프로그램 선택은 <strong>100% 사용자의 자율적 선택</strong>에 의하며 체킷은 선택된 대상을 기반으로 한 행정 지원만을 수행합니다.`
    },
    'en': {
        title: 'Personal Information Consent (Required)',
        content: `<strong>1. Purpose of Collection</strong><br>Checkit Global collects information solely for administrative support in reservations with user-selected medical institutions, 1:1 translation support, and result management.<br><br><strong>2. Items Collected (Excluding History)</strong><br>Name, DOB (6 digits), Contact, Email, Address, Currently selected checkup item/hospital, Medical reports. <span style="color:var(--primary); font-weight:800;">※ Checkit NEVER collects or requests your past medical history.</span><br><br><strong>3. Disclaimer on Medical Acts & Brokerage</strong><br>Checkit is NOT a medical institution and does NOT perform any medical acts (diagnosis, treatment, etc.). We do NOT solicit or recommend specific hospitals for profit. All selections are made <strong>100% at the user's discretion</strong>; Checkit provide administrative support based on your choices.`
    },
    'ja': {
        title: '個人情報収集及び利用同意 (必須)',
        content: `<strong>1. 収集目的</strong><br>チェックイットグローバルは、ユーザーが自律的に選択した医療機関との予約支援、通訳サポート、および結果管理のみを目的として情報を収集します。<br><br><strong>2. 収集項目 (履歴除外)</strong><br>氏名、生年月日、連絡先、メール、住所、選択した検診項目。 <span style="color:var(--primary); font-weight:800;">※ 過去の健診履歴は一切収集しません。</span><br><br><strong>3. 医療行為禁止の告知</strong><br>当サービスは医療行為を行わず、病院の推薦も行いません。すべての選択は<strong>100%ユーザーの判断</strong>によります。`
    },
    'zh-CN': {
        title: '个人信息收集及使用同意 (必填)',
        content: `<strong>1. 收集目的</strong><br>提供用户自主选择的医疗机构预约协助、翻译支持及结果管理。<br><br><strong>2. 收集项目 (不含病史)</strong><br>姓名、出生日期、联系方式、地址、当前选择的项目。 <span style="color:var(--primary); font-weight:800;">※ 我们绝不收集您的过去病史。</span><br><br><strong>3. 法律声明</strong><br>本平台不从事医疗行为，不推荐医院。所有选择均由<strong>用户100%自主决定</strong>。`
    },
    'vi': {
        title: 'Đồng ý thu thập thông tin (Bắt buộc)',
        content: `<strong>1. Mục đích</strong><br>Hỗ trợ đặt lịch, thông dịch và quản lý kết quả theo lựa chọn của người dùng.<br><br><strong>2. Thông tin thu thập</strong><br>Họ tên, ngày sinh, liên hệ, địa chỉ, hạng mục chọn. <span style="color:var(--primary); font-weight:800;">※ Chúng tôi KHÔNG thu thập lịch sử khám bệnh cũ.</span><br><br><strong>3. Miễn trừ trách nhiệm</strong><br>Chúng tôi không thực hiện hành vi y tế. Mọi lựa chọn là <strong>100% từ phía người dùng</strong>.`
    },
    'th': {
        title: 'ความยินยอมในการเก็บข้อมูล (จำเป็น)',
        content: `<strong>1. วัตถุประสงค์</strong><br>พื่อสนับสนุนการจองและแปลภาษาตามที่ผู้ใช้เลือก.<br><br><strong>2. ข้อมูลที่เก็บ (ไม่รวมประวัติ)</strong><br>ชื่อ, วันเกิด, ข้อมูลติดต่อ, ที่อยู่, รายการที่เลือก. <span style="color:var(--primary); font-weight:800;">※ เราไม่เก็บประวัติการตรวจสุขภาพย้อนหลัง.</span><br><br><strong>3. ข้อจำกัดความรับผิดชอบ</strong><br>เราไม่ทำการรักษาทางการแพทย์ การตัดสินใจทั้งหมดเป็นของ<strong>ผู้ใช้ 100%</strong>.`
    },
    'ru': {
        title: 'Согласие на сбор данных (Обязательно)',
        content: `<strong>1. Цель сбора</strong><br>Административная поддержка бронирования и перевод.<br><br><strong>2. Собираемые данные</strong><br>Имя, дата рождения, контакты, адрес, выбранные пункты. <span style="color:var(--primary); font-weight:800;">※ Мы НЕ собираем вашу прошлую историю обследований.</span><br><br><strong>3. Отказ от ответственности</strong><br>Мы не совершаем медицинских действий. Весь выбор на <strong>100% за пользователем</strong>.`
    }
};

function updateLegalContent(langCode) {
    const pipaContent = document.getElementById('pipa-content');
    if (pipaContent) {
        const trans = legalTranslations[langCode] || legalTranslations['en'];
        pipaContent.innerHTML = trans.content;
        
        // Update the label text too
        const termsLabel = document.querySelector('.terms-label');
        if (termsLabel) termsLabel.innerText = trans.title;
        
        // Update checkbox label if translated via Google, 
        // but here we can force it too if native labels exist.
    }
}

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function changeLanguage(langCode) {
    // 1. Set the Google Translate Cookie
    const cookieValue = (langCode === 'en') ? '/en/en' : `/en/${langCode}`;
    setCookie('googtrans', cookieValue, 1);

    // 2. Update Document Lang Attribute for SEO and Accessibility
    document.documentElement.lang = langCode;

    // 3. Update Legal Terms instantly
    updateLegalContent(langCode);

    // 4. Trigger Google Translate Engine - Avoid Infinite Loops
    const triggerGoogle = () => {
        const googleSelect = document.querySelector('select.goog-te-combo');
        if (googleSelect) {
            const targetValue = (langCode === 'en') ? '' : langCode;
            if (googleSelect.value !== targetValue) {
                googleSelect.value = targetValue;
                googleSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
            
            const hideGoogleBar = () => {
                const frame = document.querySelector('.goog-te-banner-frame');
                if (frame) {
                    frame.style.display = 'none';
                    frame.style.visibility = 'hidden';
                }
                document.body.style.top = '0';
            };
            hideGoogleBar();
            setTimeout(hideGoogleBar, 500);
            setTimeout(hideGoogleBar, 1500);
        } else {
            // Only retry a few times to avoid infinite logic
            if (!window.googleTranslateRetryCount) window.googleTranslateRetryCount = 0;
            if (window.googleTranslateRetryCount < 10) {
                window.googleTranslateRetryCount++;
                setTimeout(triggerGoogle, 500);
            }
        }
    };
    triggerGoogle();
}

// Check for saved language preference on load
window.addEventListener('load', () => {
    const savedLang = localStorage.getItem('preferred-lang') || 'en';
    const savedLangName = localStorage.getItem('preferred-lang-name');
    
    // Initialize UI text
    if (savedLangName && currentLangText) {
        currentLangText.innerText = savedLangName;
    }
    
    // Update legal terms box immediately
    updateLegalContent(savedLang);

    if (savedLang !== 'en') {
        const cookieValue = `/en/${savedLang}`;
        setCookie('googtrans', cookieValue, 1);
        setTimeout(() => changeLanguage(savedLang), 1500);
    }
});

// Smooth Scroll for Nav Links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update active link
                document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
                this.classList.add('active');
            }
        }
    });
});
// Reddit Slider Logic
const slider = document.getElementById('reddit-slider');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
const totalSlides = document.querySelectorAll('.slide').length;

if (slider) {
    function goToSlide(n) {
        slider.style.transform = `translateX(-${n * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[n]) dots[n].classList.add('active');
        currentSlide = n;
    }

    function nextSlide() {
        let n = (currentSlide + 1) % totalSlides;
        goToSlide(n);
    }

    // Auto-play every 5 seconds
    let slideInterval = setInterval(nextSlide, 5000);

    // Click on dots to jump to slide
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000); // Reset timer on manual interaction
        });
    });

    // Pause on hover
    slider.addEventListener('mouseleave', () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    });
}

// Auth Modal Logic
const authModal = document.getElementById('auth-modal');
const loginBtn = document.getElementById('login-btn');
const modalClose = document.getElementById('modal-close');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');

// Google Login Initialization
function initGoogleLogin() {
    if (typeof google === 'undefined') {
        setTimeout(initGoogleLogin, 500);
        return;
    }

    google.accounts.id.initialize({
        client_id: "818434232492-08aep4imjpju5k1jo2ci1b209eufgtj2.apps.googleusercontent.com", // Verified Client ID
        callback: handleGoogleSignIn
    });

    google.accounts.id.renderButton(
        document.getElementById("google-login-btn"),
        { theme: "outline", size: "large", width: "100%" }
    );
}

function handleGoogleSignIn(response) {
    // Decode JWT token (simple client-side decode)
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const user = JSON.parse(jsonPayload);
    
    // Save session
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userPicture', user.picture);
    
    // Send Confirmation Email via Google Apps Script for Google Users
    if (user.email) {
        fetch('https://script.google.com/macros/s/AKfycbxxyYRM6I6c1QIY2lQ9sGAm2DIzXz0xKAkm7ne2gUTA4car0s1VC-zMhExnBpLl6oYjIw/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, name: user.name })
        }).catch(err => console.error('Social Login Email error:', err));
    }
    
    updateAuthUI();
    
    // Close modal if open
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
        authModal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

if (authModal && loginBtn) {
    // Open Modal
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if (isLoggedIn) {
            // Open My Page instead of Auth Modal
            const mypageModal = document.getElementById('mypage-modal');
            if (mypageModal) {
                mypageModal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
            return;
        }

        authModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Init Google button when modal opens
        initGoogleLogin();
    });

    // Close Modal
    const closeModal = () => {
        authModal.classList.remove('show');
        document.body.style.overflow = '';
    };

    modalClose.addEventListener('click', closeModal);
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) closeModal();
    });

    // Tab Switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${targetTab}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });

    // Mock Form Submission
    authForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Check for PIPA agreement if it's the signup form
            const pipaCheckbox = form.querySelector('#pipa-agree-signup');
            if (pipaCheckbox && !pipaCheckbox.checked) {
                alert('Please agree to the Personal Information Collection & Usage terms.');
                return;
            }

            const submitBtn = form.querySelector('.auth-submit');
            const originalText = submitBtn.innerText;
            
            // Loading state
            submitBtn.innerText = 'Processing...';
            submitBtn.disabled = true;

            setTimeout(() => {
                const nameInput = form.querySelector('input[type="text"]');
                const displayName = nameInput ? nameInput.value : 'User';
                
                // Show Success View
                const successView = document.getElementById('signup-success');
                const signupForm = document.getElementById('signup-form');
                const authTabs = document.querySelector('.auth-tabs');
                const socialDivider = document.querySelector('.social-divider');
                const socialGrid = document.querySelector('.social-grid-single');
                const authFooter = document.querySelector('.auth-footer');

                if (successView) {
                    // Send Confirmation Email via Google Apps Script
                    const emailInput = form.querySelector('input[type="email"]');
                    const email = emailInput ? emailInput.value : '';
                    
                    if (email) {
                        fetch('https://script.google.com/macros/s/AKfycbxxyYRM6I6c1QIY2lQ9sGAm2DIzXz0xKAkm7ne2gUTA4car0s1VC-zMhExnBpLl6oYjIw/exec', {
                            method: 'POST',
                            mode: 'no-cors', // Important for GAS redirect
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: email, name: displayName })
                        }).catch(err => console.error('Email send error:', err));
                    }

                    signupForm.style.display = 'none';
                    authTabs.style.display = 'none';
                    if (socialDivider) socialDivider.style.display = 'none';
                    if (socialGrid) socialGrid.style.display = 'none';
                    if (authFooter) authFooter.style.display = 'none';
                    
                    successView.classList.add('active');

                    // After 2.5 seconds, transition to Login Form
                    setTimeout(() => {
                        successView.classList.remove('active');
                        // Show everything again but on Login Tab
                        authTabs.style.display = 'flex';
                        if (socialDivider) socialDivider.style.display = 'block';
                        if (socialGrid) socialGrid.style.display = 'flex';
                        if (authFooter) authFooter.style.display = 'block';
                        
                        // Switch to Login Tab
                        const loginTab = document.querySelector('[data-tab="login"]');
                        if (loginTab) loginTab.click();
                        
                        // Re-enable submit button for next use
                        submitBtn.innerText = originalText;
                        submitBtn.disabled = false;
                signupForm.style.display = ''; // Restore original display state
            }, 2500);
        }
    }, 1000);
});
});
}

// My Page Modal Logic
const mypageModal = document.getElementById('mypage-modal');
const mypageClose = document.getElementById('mypage-close');
const logoutBtn = document.getElementById('logout-btn');

if (mypageModal && mypageClose) {
    const closeMypage = () => {
        mypageModal.classList.remove('show');
        document.body.style.overflow = '';
    };

    mypageClose.addEventListener('click', closeMypage);
    mypageModal.addEventListener('click', (e) => {
        if (e.target === mypageModal) closeMypage();
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to sign out?')) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userName');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userPicture');
                location.reload();
            }
        });
        }

    const mypageDetailBtn = document.getElementById('btn-mypage-detail');
    if (mypageDetailBtn) {
        mypageDetailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Internal listener: Go to My Page clicked");
            if (window.showView) {
                window.showView('mypage');
            } else {
                showView('mypage');
            }
        });
    }
}

// Global View Switcher (Exposed to window for HTML onclick fallback)
window.showView = function(viewName) {
    console.log("Switching view to:", viewName);
    const homeView = document.getElementById('home-view');
    const mypageView = document.getElementById('mypage-view');
    const mypageModal = document.getElementById('mypage-modal');
    const navbar = document.getElementById('navbar');
    
    if (viewName === 'mypage') {
        // Hide global navbar to prevent overlap with chat header
        if (navbar) navbar.style.display = 'none';
        
        if (homeView) {
            homeView.classList.add('hidden-view');
            homeView.style.display = 'none';
        }
        if (mypageView) {
            mypageView.classList.remove('hidden-view');
            mypageView.style.display = 'block';
        }
        
        // Close modal
        if (mypageModal) {
            mypageModal.classList.remove('show');
            document.body.style.overflow = '';
        }
        
        if (typeof initDashboard === 'function') {
            initDashboard();
        }
    } else if (viewName === 'home') {
        // Show global navbar
        if (navbar) navbar.style.display = 'block';
        
        if (homeView) {
            homeView.classList.remove('hidden-view');
            homeView.style.display = 'block';
        }
        if (mypageView) {
            mypageView.classList.add('hidden-view');
            mypageView.style.display = 'none';
        }
    }
    
    window.scrollTo({ top: 0, behavior: 'instant' });
};

// Internal alias
function showView(name) { window.showView(name); }

let dashboardInitialized = false;
// Dashboard Chat Logic
function initDashboard() {
    console.log("initDashboard called");
    if (dashboardInitialized) return;

    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const dashLinks = document.querySelectorAll('.dash-nav-link');

    // Utility: Append Message
    window.appendMessage = function(sender, content, type = 'text') {
        const row = document.createElement('div');
        row.className = `message-row ${sender}`;
        
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (type === 'text') {
            row.innerHTML = `
                <div class="msg-bubble">
                    ${content}
                    <div class="msg-time">${timeStr}</div>
                </div>
            `;
        } else if (type === 'system') {
            row.className = 'message-row system';
            row.innerHTML = content; // Assuming content is pre-formatted HTML for system-block
        }

        chatMessages.appendChild(row);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    // Utility: Show Specific Service Block
    window.showChatBlock = function(blockType) {
        let blockHtml = '';
        let welcomeText = '';

        switch(blockType) {
            case 'booking':
                welcomeText = "Great! Let's find the best hospital for you. Here are our top recommendations in Seoul based on your profile.";
                blockHtml = `
                    <div class="system-block">
                        <div class="block-icon"><i class="fa-solid fa-hospital"></i></div>
                        <div class="block-content">
                            <p><strong>Step 1: Hospital Matching</strong></p>
                            <span>View detailed programs from SNU and Asan Medical Center.</span>
                            <div class="block-actions">
                                <button class="btn-block-primary">Open Hospital List</button>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'prep':
                welcomeText = "Preparation is key for a successful check-up. I've prepared a personalized checklist for you.";
                blockHtml = `
                    <div class="system-block">
                        <div class="block-icon"><i class="fa-solid fa-clipboard-list"></i></div>
                        <div class="block-content">
                            <p><strong>Step 2: Prep Checklist</strong></p>
                            <span>Fasting guide and required documents are listed here.</span>
                            <div class="block-actions">
                                <button class="btn-block-primary">View Checklist</button>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'results':
                welcomeText = "Your medical results are ready! I've translated them into your language for easier review.";
                blockHtml = `
                    <div class="system-block">
                        <div class="block-icon"><i class="fa-solid fa-file-medical"></i></div>
                        <div class="block-content">
                            <p><strong>Step 4: Results Hub</strong></p>
                            <span>Download 2026.04.22 Comprehensive Report (English/Korean).</span>
                            <div class="block-actions">
                                <button class="btn-block-primary">Download Report</button>
                            </div>
                        </div>
                    </div>
                `;
                break;
        }

        if (welcomeText) window.appendMessage('coord', welcomeText);
        if (blockHtml) setTimeout(() => window.appendMessage('system', blockHtml, 'system'), 500);
    };

    // Handle Sidebar Navigation as Shortcuts
    dashLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-dash');
            
            // UI Feedback
            dashLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Trigger Chat Action
            if (target !== 'overview') {
                window.showChatBlock(target);
            }
        });
    });

    // Handle User Message Sending
    function handleSendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        window.appendMessage('user', text);
        chatInput.value = '';

        // Simulated Response
        setTimeout(() => {
            window.appendMessage('coord', "I've received your request. Let me check that for you right away!");
        }, 1200);
    }

    if (chatSend && chatInput) {
        chatSend.addEventListener('click', handleSendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSendMessage();
        });
    }

    dashboardInitialized = true;

    // Dashboard Logout
    const dashLogoutBtn = document.getElementById('dash-logout-btn');
    if (dashLogoutBtn) {
        dashLogoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to sign out?')) {
                localStorage.clear();
                location.reload();
            }
        });
    }
}

function updateAuthUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userName = localStorage.getItem('userName') || 'User';
    const userEmail = localStorage.getItem('userEmail') || 'user@email.com';
    const userPicture = localStorage.getItem('userPicture');
    const loginLink = document.getElementById('login-btn');

    if (isLoggedIn && loginLink) {
        // Update Nav Button
        loginLink.innerHTML = `<i class="fa-solid fa-user-circle"></i> My Page`;
        loginLink.classList.add('logged-in');
        
        // Update My Page Modal Display
        const nameDisplay = document.getElementById('user-name-display');
        const emailDisplay = document.getElementById('user-email-display');
        const avatarDisplay = document.getElementById('user-avatar-display');

        if (nameDisplay) nameDisplay.innerText = userName;
        if (emailDisplay) emailDisplay.innerText = userEmail;
        if (avatarDisplay && userPicture) {
            avatarDisplay.innerHTML = `<img src="${userPicture}" alt="${userName}">`;
        }

        // Update Dashboard Sidebar Info
        const dashName = document.getElementById('dash-user-name');
        const dashEmail = document.getElementById('dash-user-email');
        const dashAvatar = document.getElementById('dash-avatar');

        if (dashName) dashName.innerText = userName;
        if (dashEmail) dashEmail.innerText = userEmail;
        if (dashAvatar) {
            if (userPicture) {
                dashAvatar.innerHTML = `<img src="${userPicture}" alt="${userName}">`;
            } else {
                dashAvatar.innerText = userName.charAt(0);
            }
        }
    } else if (loginLink) {
        loginLink.innerHTML = `Login`;
        loginLink.classList.remove('logged-in');
    }
}

// Initial UI Update Check
window.addEventListener('DOMContentLoaded', updateAuthUI);
