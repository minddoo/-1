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

const welcomeMessages = {
    'ko': '안녕하세요. CHECKIT을 선택해주셔서 감사합니다!! 고객님을 위한 1:1 CHECKIT의 친절하고 정확한 서포트를 진행하겠습니다. CHECKIT을 통해 한국에서의 좋은 건강검진을 경험하길 바랍니다 !',
    'en': 'Hello. Thank you for choosing CHECKIT!! We will provide friendly and accurate 1:1 CHECKIT support for you. We hope you have a great health check-up experience in Korea through CHECKIT!',
    'ja': 'こんにちは。CHECKITを選んでいただきありがとうございます！！お客様のための1:1 CHECKITの親切で正確なサポートを進行いたします。CHECKITを通じて韓国での良い健康診断を経験されることを願っています！',
    'zh-CN': '您好。感谢您选择CHECKIT！！我们将为您提供亲切且准确的1:1 CHECKIT支持。希望您能通过CHECKIT在韩国体验到优质的健康检查！',
    'vi': 'Xin chào. Cảm ơn bạn đã lựa chọn CHECKIT!! Chúng tôi sẽ thực hiện hỗ trợ 1:1 của CHECKIT một cách thân thiện và chính xác cho bạn. Hy vọng bạn sẽ có trải nghiệm khám sức khỏe tốt tại Hàn Quốc thông qua CHECKIT!',
    'th': 'สวัสดีค่ะ ขอบคุณที่เลือก CHECKIT!! เราจะดำเนินการสนับสนุนแบบ 1:1 ของ CHECKIT ที่เป็นกันเองและแม่นยำเพื่อคุณ หวังว่าคุณจะได้รับประสบการณ์การตรวจสุขภาพที่ดีในเกาหลีผ่าน CHECKIT นะคะ!',
    'ru': 'Здравствуйте. Благодарим вас за выбор CHECKIT!! Мы обеспечим дружелюбную и точную поддержку 1:1 от CHECKIT для вас. Надеемся, что вы получите отличный опыт прохождения медицинского обследования в Корее через CHECKIT!'
};

function updateWelcomeMessage(langCode) {
    const welcomeText = document.getElementById('welcome-text');
    if (welcomeText) {
        welcomeText.innerText = welcomeMessages[langCode] || welcomeMessages['en'];
    }
}

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
    updateWelcomeMessage(langCode);

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
    updateWelcomeMessage(savedLang);

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

    const savedLang = localStorage.getItem('preferred-lang') || 'en';
    updateWelcomeMessage(savedLang);

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
        const lang = localStorage.getItem('preferred-lang') || 'en';
        const consultationData = JSON.parse(localStorage.getItem('consultationData') || '{}');
        const checkupType = consultationData.type || 'General';

        switch(blockType) {
            case 'booking':
                welcomeText = "주요 의료기관 정보입니다. 기관명과 위치를 확인하실 수 있으며, 홈페이지를 통해 상세 정보를 확인하실 수 있습니다.";
                
                const hospitals = [
                    { 
                        name: "KMI 한국의학연구소", 
                        loc: "서울(광화문,여의도,강남), 수원, 대구, 부산, 광주, 제주", 
                        url: "https://www.kmi.or.kr/HLCHK/PERSONAL",
                        categories: [
                            {
                                name: "종합검진 (Comprehensive)",
                                icon: "fa-clipboard-check",
                                programs: [
                                    { 
                                        title: "화이트 (White)", 
                                        details: {
                                            "선택검사 1 (택 1)": [
                                                "위장조영촬영 (식도, 위 십이지장의 암, 궤양 등)",
                                                "위내시경검사(수면비포함) (식도, 위 십이지장의 암, 궤양 등)",
                                                "펩시노겐(혈액검사) (위암 선별검사)",
                                                "KL-6 (폐섬유화 및 간질성 폐질환)"
                                            ],
                                            "기본 검사": [
                                                "기초 검사 (신체계측, 혈압, 시력, 청력 - 청진/문진/촉진, 비만도 측정, 난시, 난청, 고혈압 등)",
                                                "체성분 (체내 골격근, 지방량 평가)",
                                                "판독 및 상담 (의사초진 및 상담 - 과거 및 현재의 건강상태, 검진결과 판독)",
                                                "구강검사 (치과 검사 - 치주염, 치석 등)"
                                            ],
                                            "장비 검사": [
                                                "흉부X선촬영 (폐결핵, 폐기종, 기관지염, 폐암)",
                                                "복부 초음파 (간, 신장, 담낭, 췌장, 비장 질환 검사)",
                                                "갑상선초음파 (결절, 낭종, 암 등의 종괴)",
                                                "심전도 (부정맥 질환 위험도 측정)",
                                                "골밀도 (골밀도(L) - 골다공증 및 골감소증)",
                                                "안압 (녹내장 유무, 안압상승)",
                                                "안저 (고혈압성/당뇨성 안저변화, 시신경염)",
                                                "폐기능 (폐의 기능과 호흡 능력)",
                                                "동맥경화검사 (말초 동맥 질환, 심혈관 위험도 등)",
                                                "부비동검사 (부비동염)"
                                            ],
                                            "혈액 검사": [
                                                "당뇨 검사 (공복혈당, 당화혈색소(HbA1c) - 당뇨병)",
                                                "지질대사 및 심혈관계 검사 (CPK, 총콜레스테롤, HDL-콜레스테롤, LDL-콜레스테롤, 중성지방, Homocysteine - 골격근/심근손상, 고지혈증, 간경변, 관상동맥경화, 동맥경화증, 알콜성지방간, 고혈압, 심혈관 질환 위험성 평가)",
                                                "갑상선 기능 검사 (TSH, 유리T4(Free T4) - 갑상선자극호르몬, 갑상선 질환 진단, 항진증, 저하증)",
                                                "간, 담도 기능 검사 (AST, ALT, γ-GTP 외 9종 - 간기능장애, 간염, 간경변, 간암 등)",
                                                "간염 (간염(B형), 간염(C형) - B형 간염, C형 간염)",
                                                "췌장기능 검사 (Amylase - 급·만성췌장염)",
                                                "신장기능 검사 (BUN, Creatinine, B/C ratio, 사구체여과율(GFR) - 신부전증, 요독증, 신우신염, 통풍성 관절염, 신기능장애, 기타 신장질환, 신부전)",
                                                "혈액학 검사 (혈색소, 백혈구수, 적혈구수 외 13종 - 각종 빈혈, 감염 등 혈액질환)",
                                                "철대사 검사 (Fe, UIBC, 철포화율, TIBC - 철 결핍성 빈혈, 빈혈, 악성종양)",
                                                "종양표지자검사 (AFP(E)-수치, CEA, PSA, CA125 - 간암, 간경화, 간병변, 대장암, 소화기계암, 전립선암, 전립선비대증, 난소암, 자궁내막증)",
                                                "통풍 및 염증반응검사 (요산, 류마티스인자(RF) - 통풍, 류마티스 관절염)",
                                                "감염 관련 혈청반응검사 (RPR정밀(매독) - 매독 선별검사)",
                                                "비타민D 검사 (25-OH Vitamin D - 골대사 및 부갑상선)"
                                            ],
                                            "여성/남성 검사": [
                                                "유방촬영 (유방촬영 - 유방암, 유선암 등 유방관련질환)",
                                                "자궁초음파 (자궁초음파 - 자궁 양, 악성 종양 및 난소 질환 등)",
                                                "자궁경부암검사 (PAP smear - 자궁경부암, 질염 등)",
                                                "전립선초음파 (전립선초음파 - 방광염, 전립선 비대, 종양 등)"
                                            ],
                                            "소변 검사": [
                                                "소변 검사 (요당, 요단백, 요비중 외 7종 - 당뇨병, 방광염, 급성 및 만성 신염 등)"
                                            ],
                                            "기타": [
                                                "색각 (색각 - 색맹, 색약과 같은 색각 이상)",
                                                "영양모니터링 서비스 (영양모니터링서비스(뉴트리뷰) - 식습관 설문을 통해 영양상태 점검 및 맞춤형 솔루션 제공)",
                                                "건강성적표 (건강성적표 - 개인별 건강성적 산출 및 질환 발병 위험도 예측)",
                                                "모바일 인지기능 평가 (기억콕콕 - 치매 위험군 및 인지기능(기억력/집중력) 저하 수준을 평가)"
                                            ]
                                        }
                                    },
                                    { 
                                        title: "실버 (Silver)", 
                                        details: {
                                            "선택검사 1 (택 1)": [
                                                "위장조영촬영 (식도, 위 십이지장의 암, 궤양 등)",
                                                "위내시경검사(수면비포함) (식도, 위 십이지장의 암, 궤양 등)",
                                                "펩시노겐(혈액검사) (위암 선별검사)",
                                                "KL-6 (폐섬유화 및 간질성 폐질환)"
                                            ],
                                            "선택검사 2 (택 1)": [
                                                "뇌CT (뇌경색, 뇌출혈 뇌종양, 퇴행성 뇌질환 등)",
                                                "경추CT (목, 척추 골절 및 뼈의 구조 이상진단 등)",
                                                "요추CT (허리, 척추 골절 및 뼈의 구조 이상진단 등)",
                                                "폐CT (폐암, 폐결핵, 폐기종, 폐결절 등의 폐질환)"
                                            ],
                                            "선택검사 3 (택 1)": [
                                                "심장초음파 (부정맥, 협심증, 심근경색증, 심장기능장애)",
                                                "수면대장내시경 (대장암, 대장용종, 직장암 등 제질환)",
                                                "M2-PK (대장암 조기진단 검사(효소 검사))",
                                                "얼리텍 (대장암 조기진단 검사(DNA 검사))"
                                            ],
                                            "기본 검사": [
                                                "기초 검사 (신체계측, 혈압, 시력, 청력 - 청진/문진/촉진, 비만도 측정, 난시, 난청, 고혈압 등)",
                                                "체성분 (체내 골격근, 지방량 평가)",
                                                "판독 및 상담 (의사초진 및 상담 - 과거 및 현재의 건강상태, 검진결과 판독)",
                                                "구강검사 (치과 검사 - 치주염, 치석 등)"
                                            ],
                                            "장비 검사": [
                                                "흉부X선촬영 (폐결핵, 폐기종, 기관지염, 폐암)",
                                                "복부 초음파 (간, 신장, 담낭, 췌장, 비장 질환 검사)",
                                                "갑상선초음파 (결절, 낭종, 암 등의 종괴)",
                                                "심전도 (부정맥 질환 위험도 측정)",
                                                "골밀도 (골밀도(L) - 골다공증 및 골감소증)",
                                                "안압 (녹내장 유무, 안압상승)",
                                                "안저 (고혈압성/당뇨성 안저변화, 시신경염)",
                                                "폐기능 (폐의 기능과 호흡 능력)",
                                                "동맥경화검사 (말초 동맥 질환, 심혈관 위험도 등)",
                                                "부비동검사 (부비동염)"
                                            ],
                                            "혈액 검사": [
                                                "당뇨 검사 (공복혈당, 당화혈색소(HbA1c) - 당뇨병)",
                                                "지질대사 및 심혈관계 검사 (CPK, 총콜레스테롤, HDL-콜레스테롤, LDL-콜레스테롤, 중성지방, Homocysteine - 골격근/심근손상, 고지혈증, 간경변, 관상동맥경화, 동맥경화증, 알콜성지방간, 고혈압, 심혈관 질환 위험성 평가)",
                                                "갑상선 기능 검사 (TSH, 유리T4(Free T4) - 갑상선자극호르몬, 갑상선 질환 진단, 항진증, 저하증)",
                                                "간, 담도 기능 검사 (AST, ALT, γ-GTP 외 9종 - 간기능장애, 간염, 간경변, 간암 등)",
                                                "간염 (간염(B형), 간염(C형) - B형 간염, C형 간염)",
                                                "췌장기능 검사 (Amylase - 급·만성췌장염)",
                                                "신장기능 검사 (BUN, Creatinine, B/C ratio, 사구체여과율(GFR) - 신부전증, 요독증, 신우신염, 통풍성 관절염, 신기능장애, 기타 신장질환, 신부전)",
                                                "혈액학 검사 (혈색소, 백혈구수, 적혈구수 외 13종 - 각종 빈혈, 감염 등 혈액질환)",
                                                "철대사 검사 (Fe, UIBC, 철포화율, TIBC - 철 결핍성 빈혈, 빈혈, 악성종양)",
                                                "종양표지자검사 (AFP(E)-수치, CEA, PSA, CA125 - 간암, 간경화, 간병변, 대장암, 소화기계암, 전립선암, 전립선비대증, 난소암, 자궁내막증)",
                                                "통풍 및 염증반응검사 (요산, 류마티스인자(RF) - 통풍, 류마티스 관절염)",
                                                "감염 관련 혈청반응검사 (RPR정밀(매독) - 매독 선별검사)",
                                                "비타민D 검사 (25-OH Vitamin D - 골대사 및 부갑상선)"
                                            ],
                                            "여성/남성 검사": [
                                                "유방촬영 (유방촬영 - 유방암, 유선암 등 유방관련질환)",
                                                "자궁초음파 (자궁초음파 - 자궁 양, 악성 종양 및 난소 질환 등)",
                                                "자궁경부암검사 (PAP smear - 자궁경부암, 질염 등)",
                                                "전립선초음파 (전립선초음파 - 방광염, 전립선 비대, 종양 등)"
                                            ],
                                            "소변 검사": [
                                                "소변 검사 (요당, 요단백, 요비중 외 7종 - 당뇨병, 방광염, 급성 및 만성 신염 등)"
                                            ],
                                            "기타": [
                                                "색각 (색각 - 색맹, 색약과 같은 색각 이상)",
                                                "영양모니터링 서비스 (영양모니터링서비스(뉴트리뷰) - 식습관 설문을 통해 영양상태 점검 및 맞춤형 솔루션 제공)",
                                                "건강성적표 (건강성적표 - 개인별 건강성적 산출 및 질환 발병 위험도 예측)",
                                                "모바일 인지기능 평가 (기억콕콕 - 치매 위험군 및 인지기능(기억력/집중력) 저하 수준을 평가)"
                                            ]
                                        }
                                    },
                                    { 
                                        title: "골드(남) (Gold Male)", 
                                        details: {
                                            "선택검사 1 (택 1)": [
                                                "위장조영촬영 (식도, 위 십이지장의 암, 궤양 등)",
                                                "위내시경검사(수면비포함) (식도, 위 십이지장의 암, 궤양 등)",
                                                "펩시노겐(혈액검사) (위암 선별검사)",
                                                "KL-6 (폐섬유화 및 간질성 폐질환)"
                                            ],
                                            "선택검사 2 (택 1)": [
                                                "뇌CT (뇌경색, 뇌출혈 뇌종양, 퇴행성 뇌질환 등)",
                                                "경추CT (목, 척추 골절 및 뼈의 구조 이상진단 등)",
                                                "요추CT (허리, 척추 골절 및 뼈의 구조 이상진단 등)",
                                                "폐CT (폐암, 폐결핵, 폐기종, 폐결절 등의 폐질환)"
                                            ],
                                            "선택검사 3 (택 1)": [
                                                "심장초음파 (부정맥, 협심증, 심근경색증, 심장기능장애)",
                                                "수면대장내시경 (대장암, 대장용종, 직장암 등 제질환)",
                                                "M2-PK (대장암 조기진단 검사(효소 검사))",
                                                "얼리텍 (대장암 조기진단 검사(DNA 검사))"
                                            ],
                                            "선택검사 4 (택 1)": [
                                                "뇌MRI (뇌출혈, 뇌경색, 뇌의 악성, 양성종양)",
                                                "경추MRI (목(경추) 디스크, 추간판 질환, 퇴행성 척추 질환 등)",
                                                "요추MRI (허리(요추) 디스크, 추간판 질환, 퇴행성 척추 질환 등)"
                                            ],
                                            "기본 검사": [
                                                "기초 검사 (신체계측, 혈압, 시력, 청력 - 청진/문진/촉진, 비만도 측정, 난시, 난청, 고혈압 등)",
                                                "체성분 (체내 골격근, 지방량 평가)",
                                                "판독 및 상담 (의사초진 및 상담 - 과거 및 현재의 건강상태, 검진결과 판독)",
                                                "구강검사 (치과 검사 - 치주염, 치석 등)"
                                            ],
                                            "장비 검사": [
                                                "흉부X선촬영 (폐결핵, 폐기종, 기관지염, 폐암)",
                                                "복부 초음파 (간, 신장, 담낭, 췌장, 비장 질환 검사)",
                                                "갑상선초음파 (결절, 낭종, 암 등의 종괴)",
                                                "심전도 (부정맥 질환 위험도 측정)",
                                                "골밀도 (골밀도(L) - 골다공증 및 골감소증)",
                                                "안압 (녹내장 유무, 안압상승)",
                                                "안저 (고혈압성/당뇨성 안저변화, 시신경염)",
                                                "폐기능 (폐의 기능과 호흡 능력)",
                                                "동맥경화검사 (말초 동맥 질환, 심혈관 위험도 등)",
                                                "부비동검사 (부비동염)"
                                            ],
                                            "혈액 검사": [
                                                "당뇨 검사 (공복혈당, 당화혈색소(HbA1c) - 당뇨병)",
                                                "지질대사 및 심혈관계 검사 (CPK, 총콜레스테롤, HDL-콜레스테롤, LDL-콜레스테롤, 중성지방, Homocysteine - 골격근/심근손상, 고지혈증, 간경변, 관상동맥경화, 동맥경화증, 알콜성지방간, 고혈압, 심혈관 질환 위험성 평가)",
                                                "갑상선 기능 검사 (TSH, 유리T4(Free T4) - 갑상선자극호르몬, 갑상선 질환 진단, 항진증, 저하증)",
                                                "간, 담도 기능 검사 (AST, ALT, γ-GTP 외 9종 - 간기능장애, 간염, 간경변, 간암 등)",
                                                "간염 (간염(B형), 간염(C형) - B형 간염, C형 간염)",
                                                "췌장기능 검사 (Amylase - 급·만성췌장염)",
                                                "신장기능 검사 (BUN, Creatinine, B/C ratio, 사구체여과율(GFR) - 신부전증, 요독증, 신우신염, 통풍성 관절염, 신기능장애, 기타 신장질환, 신부전)",
                                                "혈액학 검사 (혈색소, 백혈구수, 적혈구수 외 13종 - 각종 빈혈, 감염 등 혈액질환)",
                                                "철대사 검사 (Fe, UIBC, 철포화율, TIBC - 철 결핍성 빈혈, 빈혈, 악성종양)",
                                                "종양표지자검사 (AFP(E)-수치, CEA, PSA, CA125 - 간암, 간경화, 간병변, 대장암, 소화기계암, 전립선암, 전립선비대증, 난소암, 자궁내막증)",
                                                "통풍 및 염증반응검사 (요산, 류마티스인자(RF) - 통풍, 류마티스 관절염)",
                                                "감염 관련 혈청반응검사 (RPR정밀(매독) - 매독 선별검사)",
                                                "비타민D 검사 (25-OH Vitamin D - 골대사 및 부갑상선)"
                                            ],
                                            "여성/남성 검사": [
                                                "유방촬영 (유방촬영 - 유방암, 유선암 등 유방관련질환)",
                                                "자궁초음파 (자궁초음파 - 자궁 양, 악성 종양 및 난소 질환 등)",
                                                "자궁경부암검사 (PAP smear - 자궁경부암, 질염 등)",
                                                "전립선초음파 (전립선초음파 - 방광염, 전립선 비대, 종양 등)"
                                            ],
                                            "소변 검사": [
                                                "소변 검사 (요당, 요단백, 요비중 외 7종 - 당뇨병, 방광염, 급성 및 만성 신염 등)"
                                            ],
                                            "기타": [
                                                "색각 (색각 - 색맹, 색약과 같은 색각 이상)",
                                                "영양모니터링 서비스 (영양모니터링서비스(뉴트리뷰) - 식습관 설문을 통해 영양상태 점검 및 맞춤형 솔루션 제공)",
                                                "건강성적표 (건강성적표 - 개인별 건강성적 산출 및 질환 발병 위험도 예측)",
                                                "모바일 인지기능 평가 (기억콕콕 - 치매 위험군 및 인지기능(기억력/집중력) 저하 수준을 평가)"
                                            ]
                                        }
                                    },
                                    { 
                                        title: "골드(여) (Gold Female)", 
                                        details: {
                                            "선택검사 1 (택 1)": [
                                                "위장조영촬영 (식도, 위 십이지장의 암, 궤양 등)",
                                                "위내시경검사(수면비포함) (식도, 위 십이지장의 암, 궤양 등)",
                                                "펩시노겐(혈액검사) (위암 선별검사)",
                                                "KL-6 (폐섬유화 및 간질성 폐질환)"
                                            ],
                                            "선택검사 2 (택 1)": [
                                                "뇌CT (뇌경색, 뇌출혈 뇌종양, 퇴행성 뇌질환 등)",
                                                "경추CT (목, 척추 골절 및 뼈의 구조 이상진단 등)",
                                                "요추CT (허리, 척추 골절 및 뼈의 구조 이상진단 등)",
                                                "폐CT (폐암, 폐결핵, 폐기종, 폐결절 등의 폐질환)"
                                            ],
                                            "선택검사 3 (택 1)": [
                                                "심장초음파 (부정맥, 협심증, 심근경색증, 심장기능장애)",
                                                "수면대장내시경 (대장암, 대장용종, 직장암 등 제질환)",
                                                "M2-PK (대장암 조기진단 검사(효소 검사))",
                                                "얼리텍 (대장암 조기진단 검사(DNA 검사))"
                                            ],
                                            "선택검사 4 (택 1)": [
                                                "뇌MRI (뇌출혈, 뇌경색, 뇌의 악성, 양성종양)",
                                                "경추MRI (목(경추) 디스크, 추간판 질환, 퇴행성 척추 질환 등)",
                                                "요추MRI (허리(요추) 디스크, 추간판 질환, 퇴행성 척추 질환 등)"
                                            ],
                                            "선택검사 5 (택 1)": [
                                                "유방초음파 (유방초음파 - 유방암, 유선암 등 유방관련질환)",
                                                "마스토체크 (마스토체크 - 유방암 조기진단 검사)"
                                            ],
                                            "기본 검사": [
                                                "기초 검사 (신체계측, 혈압, 시력, 청력 - 청진/문진/촉진, 비만도 측정, 난시, 난청, 고혈압 등)",
                                                "체성분 (체내 골격근, 지방량 평가)",
                                                "판독 및 상담 (의사초진 및 상담 - 과거 및 현재의 건강상태, 검진결과 판독)",
                                                "구강검사 (치과 검사 - 치주염, 치석 등)"
                                            ],
                                            "장비 검사": [
                                                "흉부X선촬영 (폐결핵, 폐기종, 기관지염, 폐암)",
                                                "복부 초음파 (간, 신장, 담낭, 췌장, 비장 질환 검사)",
                                                "갑상선초음파 (결절, 낭종, 암 등의 종괴)",
                                                "심전도 (부정맥 질환 위험도 측정)",
                                                "골밀도 (골밀도(L) - 골다공증 및 골감소증)",
                                                "안압 (녹내장 유무, 안압상승)",
                                                "안저 (고혈압성/당뇨성 안저변화, 시신경염)",
                                                "폐기능 (폐의 기능과 호흡 능력)",
                                                "동맥경화검사 (말초 동맥 질환, 심혈관 위험도 등)",
                                                "부비동검사 (부비동염)"
                                            ],
                                            "혈액 검사": [
                                                "당뇨 검사 (공복혈당, 당화혈색소(HbA1c) - 당뇨병)",
                                                "지질대사 및 심혈관계 검사 (CPK, 총콜레스테롤, HDL-콜레스테롤, LDL-콜레스테롤, 중성지방, Homocysteine - 골격근/심근손상, 고지혈증, 간경변, 관상동맥경화, 동맥경화증, 알콜성지방간, 고혈압, 심혈관 질환 위험성 평가)",
                                                "갑상선 기능 검사 (TSH, 유리T4(Free T4) - 갑상선자극호르몬, 갑상선 질환 진단, 항진증, 저하증)",
                                                "간, 담도 기능 검사 (AST, ALT, γ-GTP 외 9종 - 간기능장애, 간염, 간경변, 간암 등)",
                                                "간염 (간염(B형), 간염(C형) - B형 간염, C형 간염)",
                                                "췌장기능 검사 (Amylase - 급·만성췌장염)",
                                                "신장기능 검사 (BUN, Creatinine, B/C ratio, 사구체여과율(GFR) - 신부전증, 요독증, 신우신염, 통풍성 관절염, 신기능장애, 기타 신장질환, 신부전)",
                                                "혈액학 검사 (혈색소, 백혈구수, 적혈구수 외 13종 - 각종 빈혈, 감염 등 혈액질환)",
                                                "철대사 검사 (Fe, UIBC, 철포화율, TIBC - 철 결핍성 빈혈, 빈혈, 악성종양)",
                                                "종양표지자검사 (AFP(E)-수치, CEA, PSA, CA125 - 간암, 간경화, 간병변, 대장암, 소화기계암, 전립선암, 전립선비대증, 난소암, 자궁내막증)",
                                                "통풍 및 염증반응검사 (요산, 류마티스인자(RF) - 통풍, 류마티스 관절염)",
                                                "감염 관련 혈청반응검사 (RPR정밀(매독) - 매독 선별검사)",
                                                "비타민D 검사 (25-OH Vitamin D - 골대사 및 부갑상선)"
                                            ],
                                            "여성/남성 검사": [
                                                "유방촬영 (유방촬영 - 유방암, 유선암 등 유방관련질환)",
                                                "자궁초음파 (자궁초음파 - 자궁 양, 악성 종양 및 난소 질환 등)",
                                                "자궁경부암검사 (PAP smear - 자궁경부암, 질염 등)",
                                                "전립선초음파 (전립선초음파 - 방광염, 전립선 비대, 종양 등)"
                                            ],
                                            "소변 검사": [
                                                "소변 검사 (요당, 요단백, 요비중 외 7종 - 당뇨병, 방광염, 급성 및 만성 신염 등)"
                                            ],
                                            "기타": [
                                                "색각 (색각 - 색맹, 색약과 같은 색각 이상)",
                                                "영양모니터링 서비스 (영양모니터링서비스(뉴트리뷰) - 식습관 설문을 통해 영양상태 점검 및 맞춤형 솔루션 제공)",
                                                "건강성적표 (건강성적표 - 개인별 건강성적 산출 및 질환 발병 위험도 예측)",
                                                "모바일 인지기능 평가 (기억콕콕 - 치매 위험군 및 인지기능(기억력/집중력) 저하 수준을 평가)"
                                            ]
                                        }
                                    },
                                    { 
                                        title: "카네이션 (Carnation)", 
                                        details: {
                                            "선택검사 1 (택 1)": [
                                                "위장조영촬영 (식도, 위 십이지장의 암, 궤양 등)",
                                                "위내시경검사(수면비포함) (식도, 위 십이지장의 암, 궤양 등)",
                                                "펩시노겐(혈액검사) (위암 선별검사)",
                                                "KL-6 (폐섬유화 및 간질성 폐질환)"
                                            ],
                                            "선택검사 2 (택 1)": [
                                                "수면대장내시경 (대장암, 대장용종, 직장암 등 제질환)",
                                                "M2-PK (대장암 조기진단 검사(효소 검사))",
                                                "얼리텍 (대장암 조기진단 검사(DNA 검사))",
                                                "뇌CT (뇌경색, 뇌출혈 뇌종양, 퇴행성 뇌질환 등)",
                                                "경추CT (목, 척추 골절 및 뼈의 구조 이상진단 등)",
                                                "요추CT (허리, 척추 골절 및 뼈의 구조 이상진단 등)",
                                                "폐CT (폐암, 폐결핵, 폐기종, 폐결절 등의 폐질환)"
                                            ],
                                            "기본 검사": [
                                                "기초 검사 (신체계측, 혈압, 시력, 청력 - 청진/문진/촉진, 비만도 측정, 난시, 난청, 고혈압 등)",
                                                "체성분 (체내 골격근, 지방량 평가)",
                                                "판독 및 상담 (의사초진 및 상담 - 과거 및 현재의 건강상태, 검진결과 판독)",
                                                "구강검사 (치과 검사 - 치주염, 치석 등)"
                                            ],
                                            "장비 검사": [
                                                "흉부X선촬영 (폐결핵, 폐기종, 기관지염, 폐암)",
                                                "복부 초음파 (간, 신장, 담낭, 췌장, 비장 질환 검사)",
                                                "갑상선초음파 (결절, 낭종, 암 등의 종괴)",
                                                "심전도 (부정맥 질환 위험도 측정)",
                                                "골밀도 (골밀도(L) - 골다공증 및 골감소증)",
                                                "안압 (녹내장 유무, 안압상승)",
                                                "안저 (고혈압성/당뇨성 안저변화, 시신경염)",
                                                "폐기능 (폐의 기능과 호흡 능력)",
                                                "동맥경화검사 (말초 동맥 질환, 심혈관 위험도 등)",
                                                "부비동검사 (부비동염)"
                                            ],
                                            "혈액 검사": [
                                                "당뇨 검사 (공복혈당, 당화혈색소(HbA1c) - 당뇨병)",
                                                "지질대사 및 심혈관계 검사 (CPK, 총콜레스테롤, HDL-콜레스테롤, LDL-콜레스테롤, 중성지방, Homocysteine - 골격근/심근손상, 고지혈증, 간경변, 관상동맥경화, 동맥경화증, 알콜성지방간, 고혈압, 심혈관 질환 위험성 평가)",
                                                "갑상선 기능 검사 (TSH, 유리T4(Free T4) - 갑상선자극호르몬, 갑상선 질환 진단, 항진증, 저하증)",
                                                "간, 담도 기능 검사 (AST, ALT, γ-GTP 외 9종 - 간기능장애, 간염, 간경변, 간암 등)",
                                                "간염 (간염(B형), 간염(C형) - B형 간염, C형 간염)",
                                                "췌장기능 검사 (Amylase - 급·만성췌장염)",
                                                "신장기능 검사 (BUN, Creatinine, B/C ratio, 사구체여과율(GFR) - 신부전증, 요독증, 신우신염, 통풍성 관절염, 신기능장애, 기타 신장질환, 신부전)",
                                                "혈액학 검사 (혈색소, 백혈구수, 적혈구수 외 13종 - 각종 빈혈, 감염 등 혈액질환)",
                                                "철대사 검사 (Fe, UIBC, 철포화율, TIBC - 철 결핍성 빈혈, 빈혈, 악성종양)",
                                                "종양표지자검사 (AFP(E)-수치, CEA, PSA, CA125 - 간암, 간경화, 간병변, 대장암, 소화기계암, 전립선암, 전립선비대증, 난소암, 자궁내막증)",
                                                "통풍 및 염증반응검사 (요산, 류마티스인자(RF) - 통풍, 류마티스 관절염)",
                                                "감염 관련 혈청반응검사 (RPR정밀(매독) - 매독 선별검사)",
                                                "비타민D 검사 (25-OH Vitamin D - 골대사 및 부갑상선)"
                                            ],
                                            "여성/남성 검사": [
                                                "유방촬영 (유방촬영 - 유방암, 유선암 등 유방관련질환)",
                                                "자궁초음파 (자궁초음파 - 자궁 양, 악성 종양 및 난소 질환 등)",
                                                "자궁경부암검사 (PAP smear - 자궁경부암, 질염 등)",
                                                "전립선초음파 (전립선초음파 - 방광염, 전립선 비대, 종양 등)"
                                            ],
                                            "소변 검사": [
                                                "소변 검사 (요당, 요단백, 요비중 외 7종 - 당뇨병, 방광염, 급성 및 만성 신염 등)"
                                            ],
                                            "기타": [
                                                "색각 (색각 - 색맹, 색약과 같은 색각 이상)",
                                                "영양모니터링 서비스 (영양모니터링서비스(뉴트리뷰) - 식습관 설문을 통해 영양상태 점검 및 맞춤형 솔루션 제공)",
                                                "건강성적표 (건강성적표 - 개인별 건강성적 산출 및 질환 발병 위험도 예측)",
                                                "모바일 인지기능 평가 (기억콕콕 - 치매 위험군 및 인지기능(기억력/집중력) 저하 수준을 평가)"
                                            ]
                                        }
                                    }
                                ]
                            },
                        ]
                    },
                    { 
                        name: "하나로의료재단", 
                        loc: "서울(종로, 강남)", 
                        url: "https://www.hanaromf.com/program/prog01/prog01_01.jsp",
                        categories: [
                            {
                                name: "종합검진 (Comprehensive)",
                                icon: "fa-clipboard-check",
                                programs: [
                                    { 
                                        title: "기본 종합검진 (Basic)", 
                                        details: {
                                            "검사 항목 상세": [
                                                "복부초음파 (간,담낭,신장,비장,췌장 검사)",
                                                "위내시경 (위암, 위궤양, 위염, 헬리코박터균 등)",
                                                "진정(수면) 내시경 (희망 시 50,000원 추가)",
                                                "골밀도 (골량감소, 골다공증)",
                                                "흉부 X-ray 촬영 (폐암, 폐결핵, 폐렴 등)",
                                                "폐기능 (폐의 기도저항, 기관지 협착 등)",
                                                "의사진료 및 상담 (과거병력, 신체상태 진료)",
                                                "신체계측 (신장, 체중, 허리둘레, 비만도)",
                                                "체성분 측정 (비만도, 신체균형, 내장지방 등)",
                                                "혈압, 맥박 (고혈압, 저혈압, 빈맥, 서맥)",
                                                "시력 (근시, 원시)",
                                                "안저촬영 (망막염, 시신경염, 안저변화 등)",
                                                "안압측정 (녹내장)",
                                                "청력정밀 (난청, 청력관련 정밀검사)",
                                                "A형간염 항체 (A형간염 검사)",
                                                "B형간염 항원, 항체 (B형간염 검사)",
                                                "간장질환 혈액검사 (황달, 급만성간염 등)",
                                                "일반혈액질환 혈액검사 (빈혈, 백혈병, 감염 등)",
                                                "중성지방 혈액검사 (동맥경화, 이상지질혈증 등)",
                                                "EKG (부정맥, 협심증, 심근경색 등)",
                                                "당뇨질환 혈액검사 (당뇨병)",
                                                "신장질환 혈액검사 (신기능장애, 신부전증 등)",
                                                "요산, 류마티스 인자 혈액검사 (통풍성 관절염 등)",
                                                "암표지자 (AFP, CEA, CA-125(여자), PSA(남자))",
                                                "매독반응검사 (매독 감염여부)",
                                                "뇨침사검경 (신장, 당뇨, 요로감염 등)",
                                                "Free T4, TSH (갑상선기능 항진증 또는 저하증)",
                                                "유방 x-ray 촬영 (유방암, 섬유선종, 석회화 등)",
                                                "자궁 도말 세포진 (자궁경부암, 염증 등)",
                                                "구강 (치주질환 및 충치)"
                                            ]
                                        }
                                    },
                                    { 
                                        title: "브론즈 (Bronze)", 
                                        details: {
                                            "MDCT 택 1 (부위별 정밀 CT)": [
                                                "흉부 MDCT (폐암, 폐결핵, 폐렴, 기관지염 등)",
                                                "뇌 MDCT (뇌종양, 뇌경색, 뇌출혈, 뇌혈관질환 등)",
                                                "경추 MDCT (퇴행성 경추질환)",
                                                "요추 MDCT (퇴행성 요추질환)"
                                            ],
                                            "암표지자 / 바이러스": [
                                                "CA 19-9 (췌장암, 담낭담관암)",
                                                "C형간염 항체 (C형간염 검사)"
                                            ],
                                            "정밀 초음파": [
                                                "골반초음파(여성) (자궁, 난소, 난관질환)",
                                                "하복부초음파(남성) (전립선비대, 전립선질환)",
                                                "갑상선초음파 (갑상선암, 결절, 낭종 등)"
                                            ],
                                            "생체 기능 검사": [
                                                "동맥경화도 (동맥경화, 폐쇄성 동맥경화증 등)"
                                            ],
                                            "기본 종합검진 항목": [
                                                "복부초음파 (간,담낭,신장,비장,췌장 검사)",
                                                "위내시경 (위암, 위궤양, 위염, 헬리코박터균 등)",
                                                "진정(수면) 내시경 (희망 시 50,000원 추가)",
                                                "골밀도 (골량감소, 골다공증)",
                                                "흉부 X-ray 촬영 (폐암, 폐결핵, 폐렴 등)",
                                                "폐기능 (폐의 기도저항, 기관지 협착 등)",
                                                "의사진료 및 상담 (과거병력, 신체상태 진료)",
                                                "신체계측 (신장, 체중, 허리둘레, 비만도)",
                                                "체성분 측정 (비만도, 신체균형, 내장지방 등)",
                                                "혈압, 맥박 (고혈압, 저혈압, 빈맥, 서맥)",
                                                "시력 (근시, 원시)",
                                                "안저촬영 (망막염, 시신경염, 안저변화 등)",
                                                "안압측정 (녹내장)",
                                                "청력정밀 (난청, 청력관련 정밀검사)",
                                                "A형간염 항체 (A형간염 검사)",
                                                "B형간염 항원, 항체 (B형간염 검사)",
                                                "간장질환 혈액검사 (황달, 급만성간염 등)",
                                                "일반혈액질환 혈액검사 (빈혈, 백혈병, 감염 등)",
                                                "중성지방 혈액검사 (동맥경화, 이상지질혈증 등)",
                                                "EKG (부정맥, 협심증, 심근경색 등)",
                                                "당뇨질환 혈액검사 (당뇨병)",
                                                "신장질환 혈액검사 (신기능장애, 신부전증 등)",
                                                "요산, 류마티스 인자 혈액검사 (통풍성 관절염 등)",
                                                "암표지자 (AFP, CEA, CA-125(여자), PSA(남자))",
                                                "매독반응검사 (매독 감염여부)",
                                                "뇨침사검경 (신장, 당뇨, 요로감염 등)",
                                                "Free T4, TSH (갑상선기능 항진증 또는 저하증)",
                                                "유방 x-ray 촬영 (유방암, 섬유선종, 석회화 등)",
                                                "자궁 도말 세포진 (자궁경부암, 염증 등)",
                                                "구강 (치주질환 및 충치)"
                                            ]
                                        }
                                    },
                                    { 
                                        title: "실버 (Silver)", 
                                        details: {
                                            "MDCT 택 1 (부위별 정밀 CT)": [
                                                "흉부 MDCT (폐암, 폐결핵, 폐염, 기관지염 등)",
                                                "뇌 MDCT (뇌종양, 뇌경색, 뇌출혈, 뇌혈관질환 등)",
                                                "경추 MDCT (퇴행성 경추질환)",
                                                "요추 MDCT (퇴행성 요추질환)"
                                            ],
                                            "정밀 내시경": [
                                                "대장 내시경 (대장암, 직장암, 대장용종, 치질 등)",
                                                "진정(수면) 내시경 (수면약제비 포함)",
                                                "위내시경 (위암, 위궤양, 위염, 헬리코박터균 등)",
                                                "진정(수면) 위내시경 (희망 시 50,000원 추가)"
                                            ],
                                            "정밀 초음파 (Silver)": [
                                                "유방초음파 (유방종물, 유방낭종, 유방암, 유선염 등)",
                                                "경동맥초음파 (경동맥협착, 부분적 동맥 폐색)",
                                                "골반초음파(여성) (자궁, 난소, 난관질환)",
                                                "하복부초음파(남성) (전립선비대, 전립선질환)",
                                                "갑상선초음파 (갑상선암, 결절, 낭종 등)"
                                            ],
                                            "심혈관 / 혈당 정밀": [
                                                "Homocysteine (심혈관질환, 뇌혈관질환, 말초혈관질환 등)",
                                                "당화혈색소 (2~3개월 평균혈당 추적검사)",
                                                "동맥경화도 (동맥경화, 폐쇄성 동맥경화증 등)"
                                            ],
                                            "암표지자 / 바이러스 / 기타": [
                                                "CA 19-9 (췌장암, 담낭담관암)",
                                                "H. Pylori Ab (헬리코박터균 검사)",
                                                "C형간염 항체 (C형간염 검사)",
                                                "액상세포검사 (자궁경부암 정밀)"
                                            ],
                                            "기본 및 브론즈 공통 항목": [
                                                "복부초음파 (간,담낭,신장,비장,췌장 검사)",
                                                "골밀도 (골량감소, 골다공증)",
                                                "흉부 X-ray 촬영 (폐암, 폐결핵, 폐렴 등)",
                                                "폐기능 (폐의 기도저항, 기관지 협착 등)",
                                                "의사진료 및 상담 (과거병력, 신체상태 진료)",
                                                "신체계측 (신장, 체중, 허리둘레, 비만도)",
                                                "체성분 측정 (비만도, 신체균형, 내장지방 등)",
                                                "혈압, 맥박 (고혈압, 저혈압, 빈맥, 서맥)",
                                                "시력 (근시, 원시)",
                                                "안저촬영 (망막염, 시신경염, 안저변화 등)",
                                                "안압측정 (녹내장)",
                                                "청력정밀 (난청, 청력관련 정밀검사)",
                                                "A형간염 항체",
                                                "B형간염 항원, 항체",
                                                "간장질환 혈액검사",
                                                "일반혈액질환 혈액검사",
                                                "중성지방 혈액검사",
                                                "EKG (심전도)",
                                                "당뇨질환 혈액검사",
                                                "신장질환 혈액검사",
                                                "요산, 류마티스 인자 혈액검사",
                                                "암표지자 (AFP, CEA, CA-125(여자), PSA(남자))",
                                                "매독반응검사",
                                                "뇨침사검경",
                                                "Free T4, TSH (갑상선)",
                                                "유방 x-ray 촬영",
                                                "자궁 도말 세포진",
                                                "구강 (치주질환 및 충치)"
                                            ]
                                        }
                                    },
                                    { 
                                        title: "골드 (Gold)", 
                                        details: {
                                            "뇌 정밀 MRI/MRA": [
                                                "뇌 MRI (뇌종양, 뇌경색 등)",
                                                "뇌 MRA (뇌출혈 등)"
                                            ],
                                            "심장 정밀 검사": [
                                                "심장칼슘스코어링 (심장 관상동맥경화도)",
                                                "심장초음파 (심장기능, 심실비대, 부정맥, 판막질환 등)"
                                            ],
                                            "MDCT 택 1 (부위별 정밀 CT)": [
                                                "흉부 MDCT (폐암, 폐결핵, 폐염, 기관지염 등)",
                                                "뇌 MDCT (뇌종양, 뇌경색, 뇌출혈, 뇌혈관질환 등)",
                                                "경추 MDCT (퇴행성 경추질환)",
                                                "요추 MDCT (퇴행성 요추질환)"
                                            ],
                                            "정밀 내시경": [
                                                "대장 내시경 (대장암, 직장암, 대장용종, 치질 등)",
                                                "진정(수면) 내시경 (수면약제비 포함)",
                                                "위내시경 (위암, 위궤양, 위염, 헬리코박터균 등)",
                                                "진정(수면) 위내시경 (희망 시 50,000원 추가)"
                                            ],
                                            "호르몬 / 혈당 정밀": [
                                                "HOMA-IR (인슐린 저항성 검사)",
                                                "E2, FSH(여자) (여성호르몬 부족, 노화, 질환 검사)",
                                                "Testosterone(남자) (남성호르몬 질환 검사)",
                                                "Homocysteine (심혈관/뇌혈관/말초혈관 질환)",
                                                "당화혈색소 (2~3개월 평균혈당 추적검사)"
                                            ],
                                            "암표지자 / 여성 정밀": [
                                                "Cyfra 21-1 (폐암 지표)",
                                                "ROMA Score (난소암 검사)",
                                                "인유두종바이러스(HPV) (인유두종검사)",
                                                "액상세포검사 (자궁경부암 정밀)",
                                                "CA 19-9 (췌장암, 담낭담관암)"
                                            ],
                                            "정밀 초음파 (Gold)": [
                                                "유방초음파 (유방종물, 유방낭종, 유방암, 유선염 등)",
                                                "경동맥초음파 (경동맥협착, 부분적 동맥 폐색)",
                                                "골반초음파(여성) (자궁, 난소, 난관질환)",
                                                "하복부초음파(남성) (전립선비대, 전립선질환)",
                                                "갑상선초음파 (갑상선암, 결절, 낭종 등)",
                                                "복부초음파 (간,담낭,신장,비장,췌장 검사)"
                                            ],
                                            "기타 공통 항목": [
                                                "동맥경화도",
                                                "H. Pylori Ab (헬리코박터)",
                                                "골밀도 (골다공증)",
                                                "흉부 X-ray",
                                                "폐기능 (호흡기질환)",
                                                "의사진료 및 상담",
                                                "신체계측 (신장, 체중, 비만도)",
                                                "체성분 측정",
                                                "혈액 검사 (간기능, 혈당, 신장, 혈액질환 등)",
                                                "바이러스 (A/B/C형 간염)",
                                                "심전도 (EKG)",
                                                "암표지자 (AFP, CEA, CA-125, PSA)",
                                                "매독반응검사",
                                                "뇨침사검경",
                                                "Free T4, TSH (갑상선)",
                                                "유방 x-ray, 자궁 도말 세전",
                                                "구강 (치주질환 및 충치)"
                                            ]
                                        }
                                    },
                                    { 
                                        title: "플래티늄 (Platinum)", 
                                        details: {
                                            "NGS 유전자 검사 (택 1)": [
                                                "NGS 유전성 암 유전자 검사 (유방,난소,대장,췌장,위암 등)",
                                                "NGS 유전성 부정맥 유전자 검사",
                                                "NGS 유전성 심근 병증 유전자 검사",
                                                "NGS 유전성 뇌혈관질환 유전자 검사",
                                                "NGS 유전성 뼈대사 질환 유전자 검사"
                                            ],
                                            "척추 정밀 MRI (택 1)": [
                                                "요추 MRI (요통, 좌골신경통, 대퇴신경통)",
                                                "경추 MRI (후경부 통증, 상지통증, 상지약화)"
                                            ],
                                            "뇌 정밀 MRI/MRA": [
                                                "뇌 MRI (뇌종양, 뇌경색 등)",
                                                "뇌 MRA (뇌출혈 등)"
                                            ],
                                            "심장 정밀 검사": [
                                                "심장칼슘스코어링 (심장 관상동맥경화도)",
                                                "심장초음파 (심장기능, 심실비대, 부정맥, 판막질환 등)"
                                            ],
                                            "MDCT 택 1 (부위별 정밀 CT)": [
                                                "흉부 MDCT (폐암, 폐결핵, 폐염, 기관지염 등)",
                                                "뇌 MDCT (뇌종양, 뇌경색, 뇌출혈, 뇌혈관질환 등)",
                                                "경추 MDCT (퇴행성 경추질환)",
                                                "요추 MDCT (퇴행성 요추질환)"
                                            ],
                                            "정밀 내시경": [
                                                "대장 내시경 (대장암, 직장암, 대장용종, 치질 등)",
                                                "진정(수면) 내시경 (수면약제비 포함)",
                                                "위내시경 (위암, 위궤양, 위염, 헬리코박터균 등)",
                                                "진정(수면) 위내시경 (희망 시 50,000원 추가)"
                                            ],
                                            "알레르기 / 호르몬 정밀": [
                                                "Total IgE (아토피, 천식 등 면역검사)",
                                                "HOMA-IR (인슐린 저항성)",
                                                "E2, FSH(여자) / Testosterone(남자)",
                                                "Homocysteine (심혈관/뇌혈관/말초혈관)",
                                                "당화혈색소 (평균혈당 추적)"
                                            ],
                                            "정밀 초음파 (Platinum)": [
                                                "유방/경동맥/골반(여)/하복부(남)/갑상선/복부 초음파"
                                            ],
                                            "암표지자 / 여성 정밀": [
                                                "Cyfra 21-1 (폐암)",
                                                "ROMA Score (난소암)",
                                                "인유두종바이러스(HPV)",
                                                "액상세포검사 (자궁경부암)",
                                                "CA 19-9 (췌장암)"
                                            ],
                                            "공통 기초 및 정밀 항목": [
                                                "골밀도, 동맥경화, EKG, 흉부 X-ray, 폐기능, 청력, 안과, 구강",
                                                "종합 혈액 검사 (바이러스, 간, 신장, 혈당, 암표지자 등)",
                                                "신체계측, 체성분 측정, 상담, 소변 검사"
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    { 
                        name: "세브란스병원 센터", 
                        loc: "서울(신촌, 강남)", 
                        url: "https://severance.healthcare/severance/program/index.do",
                        categories: [
                            {
                                name: "종합검진 (Comprehensive)",
                                icon: "fa-clipboard-check",
                                programs: [
                                    { title: "기본 검진", items: "세브란스 프리미엄 성인 필수 정밀 검사 중심의 기본형." },
                                    { title: "프리미엄/플래티넘", items: "정밀도 높은 심층 검사와 첨단 장비를 활용한 고품격 프로그램." },
                                    { title: "분야별 정밀", items: "심장, 뇌졸중, SAFE암 등 특정 질환 집중 조기 진단 패키지." }
                                ]
                            }
                        ]
                    },
                    { 
                        name: "삼성서울병원 센터", 
                        loc: "서울(일원동)", 
                        url: "https://www.samsunghospital.com/home/health/program/individual/basic_info.do",
                        categories: [
                            {
                                name: "종합검진 (Comprehensive)",
                                icon: "fa-clipboard-check",
                                programs: [
                                    { title: "라이프스테이지별", items: "연령 및 생애 주기별 특성에 맞춘 맞춤형 건강검진 코스." },
                                    { title: "분야별 정밀", items: "암, 심혈관 등 특정 분야에 집중된 고해상도 정밀 검사 패키지." },
                                    { title: "프리미엄", items: "전담 교수 상담과 최첨단 장비 중심의 프리미엄 검진." }
                                ]
                            }
                        ]
                    },
                    { 
                        name: "세란병원 센터", 
                        loc: "서울(종로/독립문)", 
                        url: "https://www.seran.co.kr/05_center/center01_03.php",
                        categories: [
                            {
                                name: "종합검진 (Comprehensive)",
                                icon: "fa-clipboard-check",
                                programs: [
                                    { title: "베이직/그린/블루", items: "실속형 종합검진 및 핵심 정밀 항목 조합." },
                                    { title: "실버/골드", items: "뇌 MRI/MRA, 특수 혈액검사 등이 추가된 고화질 정밀 검진." },
                                    { title: "크리스탈", items: "PET-CT 및 전신 정밀 검사가 포함된 최고급 프로그램." }
                                ]
                            }
                        ]
                    }
                ];

                blockHtml = `
                    <div class="msg-bubble hospital-integrated-card" style="background: white; border-radius: 12px; padding: 16px; border: 1px solid #edf2f7; width: 90%; align-self: flex-start;">
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            ${hospitals.map((h, i) => {
                                const proxyUrl = h.url;
                                const hospitalId = `hospital-${i}`;
                                return `
                                        <li id="li-hospital-${i}" class="hospital-list-item" style="padding: 12px 10px; border-bottom: ${i === hospitals.length - 1 ? 'none' : '1px solid #f1f5f9'}; border-radius: 12px; transition: var(--transition); cursor: pointer;" onclick="toggleHospitalPrograms('${hospitalId}')">
                                            <div class="notranslate" style="font-weight: 800; color: var(--text-dark); font-size: 0.95rem; margin-bottom: 4px;">${h.name}</div>
                                            <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 8px;"><i class="fa-solid fa-location-dot" style="margin-right:4px;"></i>${h.loc}</div>
                                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                                <a href="${proxyUrl}" target="_blank" onclick="event.stopPropagation()" style="display: inline-block; padding: 6px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; color: #475569; text-decoration: none; font-size: 0.75rem; font-weight: 600;">홈페이지 / 정보 보기</a>
                                                <button class="btn-toggle-programs" onclick="event.stopPropagation(); toggleHospitalPrograms('${hospitalId}')">검진 항목 보기</button>
                                                <button class="btn-select-hospital" onclick="event.stopPropagation(); selectHospital(${i}, '${hospitalId}')">이 병원으로 선택</button>
                                            </div>
                                        
                                        <div id="${hospitalId}" class="hospital-programs">
                                            ${h.categories.map((cat, catIdx) => `
                                                <div class="program-category-group">
                                                    <div class="category-label"><i class="fa-solid ${cat.icon || 'fa-clipboard-check'}"></i> ${cat.name}</div>
                                                    <div class="program-tags-container">
                                                        ${cat.programs.map((p, pIdx) => `
                                                            <div class="program-item-chip" onclick="event.stopPropagation(); openProgramModal(${i}, ${catIdx}, ${pIdx})">
                                                                <span class="chip-title notranslate">${p.title}</span>
                                                                <i class="fa-solid fa-chevron-right chip-arrow"></i>
                                                            </div>
                                                        `).join('')}
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </li>
                                `;
                            }).join('')}
                        </ul>
                    </div>
                `;
                // Store hospitals in body for easier access by modal
                document.body.setAttribute('data-hospitals', JSON.stringify(hospitals));
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
        if (blockHtml) {
            setTimeout(() => {
                window.appendMessage('system', blockHtml, 'system');
            }, 500);
        }
    };

    window.toggleHospitalPrograms = function(id) {
        const el = document.getElementById(id);
        if (el) {
            el.classList.toggle('active');
            const btn = el.previousElementSibling.querySelector('.btn-toggle-programs');
            if (btn) {
                btn.innerText = el.classList.contains('active') ? '상세 정보 닫기' : '검진 항목 보기';
            }
        }
    };

    window.openProgramModal = function(hIdx, catIdx, pIdx) {
        const hospitals = JSON.parse(document.body.getAttribute('data-hospitals') || '[]');
        const hospital = hospitals[hIdx];
        if (!hospital) return;
        
        const program = hospital.categories[catIdx].programs[pIdx];
        if (!program || !program.details) {
            console.log("No detailed items for this program yet.");
            return;
        }

        const modal = document.getElementById('program-modal');
        const hospitalNameEl = document.getElementById('modal-hospital-name');
        const programNameEl = document.getElementById('modal-program-name');
        const container = document.getElementById('program-items-container');

        hospitalNameEl.innerText = hospital.name;
        programNameEl.innerText = program.title;
        
        let html = '';
        const icons = {
            "기초": "fa-stethoscope",
            "장비": "fa-microscope",
            "진단": "fa-vial",
            "영상": "fa-x-ray",
            "항목": "fa-list-check",
            "선택": "fa-plus-circle",
            "특화": "fa-star"
        };

        for (const [cat, items] of Object.entries(program.details)) {
            let iconClass = "fa-circle-dot";
            for (const key in icons) {
                if (cat.includes(key)) {
                    iconClass = icons[key];
                    break;
                }
            }
            
            html += `
                <div class="item-cat-box">
                    <h5><i class="fa-solid ${iconClass}"></i> ${cat}</h5>
                    <ul>
                        ${items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        // Add Selection Button to Modal
        html += `
            <div class="program-modal-footer">
                <button class="btn-select-program" onclick="selectProgram(${hIdx}, ${catIdx}, ${pIdx})">
                    이 프로그램으로 선택하기
                </button>
            </div>
        `;
        
        container.innerHTML = html;

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    window.selectHospital = function(hIdx, hospitalId) {
        // Toggle programs list
        const el = document.getElementById(hospitalId);
        if (el && !el.classList.contains('active')) {
            window.toggleHospitalPrograms(hospitalId);
        }
        
        // Highlight selection
        document.querySelectorAll('.hospital-list-item').forEach(item => item.classList.remove('selected'));
        const li = document.getElementById(`li-hospital-${hIdx}`);
        if (li) li.classList.add('selected');
        
        console.log(`Hospital ${hIdx} pre-selected. Now pick a program.`);
    };

    window.selectProgram = function(hIdx, catIdx, pIdx) {
        const hospitals = JSON.parse(document.body.getAttribute('data-hospitals') || '[]');
        const hospital = hospitals[hIdx];
        const program = hospital.categories[catIdx].programs[pIdx];
        
        // Close modal
        window.closeProgramModal();
        
        // Feedback message
        setTimeout(() => {
            const confirmMsg = `확인되었습니다! **${hospital.name}**의 **${program.title}** 프로그램을 선택하셨습니다. <br><br>예약 및 추가 상담을 이어가시겠습니까?`;
            window.appendMessage('coord', confirmMsg);
            
            // Highlight the chip in the background UI if needed, but chat bubbles are ephemeral.
            // We can add a "Selected" state to the hospital card
            document.querySelectorAll('.hospital-list-item').forEach(item => item.classList.remove('selected'));
            const li = document.getElementById(`li-hospital-${hIdx}`);
            if (li) li.classList.add('selected');
        }, 300);
    };

    window.closeProgramModal = function() {
        const modal = document.getElementById('program-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    };

    // Close button listener
    document.getElementById('program-modal-close').addEventListener('click', window.closeProgramModal);
    document.getElementById('program-modal').addEventListener('click', (e) => {
        if (e.target.id === 'program-modal') window.closeProgramModal();
    });

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
    
    // Auto-render or Restore Chat State
    const savedData = localStorage.getItem('consultationData');
    if (savedData) {
        // Restore history without showing form
        const stepConsultation = document.getElementById('step-consultation');
        if (stepConsultation) stepConsultation.style.display = 'none';
        
        const data = JSON.parse(savedData);
        
        // Render FULL history summary exactly as filled
        window.appendMessage('user', generateConsultationSummaryHtml(data));
        
        // Immediately show hospitals
        setTimeout(() => window.showChatBlock('booking'), 600);
    } else {
        renderInlineConsultationForm();
    }

    // Dashboard Logout
    const dashLogoutBtn = document.getElementById('dash-logout-btn');
    if (dashLogoutBtn) {
        dashLogoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to sign out?')) {
                // Keep consultationData for session continuity as requested
                const consultationData = localStorage.getItem('consultationData');
                localStorage.clear();
                if (consultationData) localStorage.setItem('consultationData', consultationData);
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

// --- Consultation Form Integration Functions ---
function generateConsultationSummaryHtml(data) {
    const finalDocs = data.docs + (data.docsOther ? ', ' + data.docsOther : '');
    return `
        <div class="consultation-summary" style="font-size: 0.9rem; line-height: 1.6;">
            <strong style="display:block; margin-bottom:8px; font-size:1rem; border-bottom:1px solid rgba(255,255,255,0.3); padding-bottom:5px;">📋 Medical Consultation Request</strong>
            • <b>Name:</b> ${data.name} (${data.dob})<br>
            • <b>Contact:</b> ${data.phone} / ${data.email}<br>
            • <b>Schedule:</b> ${data.arrival} ~ ${data.departure}<br>
            • <b>Preferred Period:</b> ${data.period} (${data.time === 'AM' ? 'Morning' : 'Afternoon'})<br>
            • <b>Type:</b> ${data.type}<br>
            • <b>Hospital:</b> ${data.hospitalOpt === 'Yes' ? `<span class="notranslate">${data.prefHospital}</span>` : 'Request Recommended List'}<br>
            • <b>Results:</b> ${data.reception}<br>
            • <b>Documents:</b> ${finalDocs || 'None'}<br>
            ${data.address ? `• <b>Address:</b> ${data.address}` : ''}
        </div>
    `;
}

function renderInlineConsultationForm() {
    const container = document.getElementById('inline-consultation-form-container');
    if (!container) return;
    
    // Pre-fill user data
    const savedName = localStorage.getItem('userName') || '';
    const savedEmail = localStorage.getItem('userEmail') || '';

    container.innerHTML = `
        <div class="chat-form-box notranslate" style="margin: 15px 0 0 0; padding: 20px; background: rgba(255,255,255,0.8); border-radius: 20px; border: 1.5px solid rgba(46, 204, 113, 0.2);">
            <div class="c-form-group">
                <label style="display:block; margin-bottom:5px; font-weight:700; font-size:0.85rem;">Full Name</label>
                <input type="text" id="c-name" value="${savedName}" placeholder="Name of test-taker" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
            </div>
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;">
                <div class="c-form-group">
                    <label style="display:block; margin-bottom:5px; font-weight:700; font-size:0.85rem;">DOB (YYMMDD)</label>
                    <input type="text" id="c-dob" placeholder="6 digits" maxlength="6" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
                </div>
                <div class="c-form-group">
                    <label style="display:block; margin-bottom:5px; font-weight:700; font-size:0.85rem;">Phone (Alimtalk)</label>
                    <input type="tel" id="c-phone" placeholder="+82..." style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
                </div>
            </div>

            <div class="c-form-group" style="margin-top:10px;">
                <label style="display:block; margin-bottom:5px; font-weight:700; font-size:0.85rem;">Email Address</label>
                <input type="email" id="c-email" value="${savedEmail}" placeholder="your@email.com" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
            </div>

            <div class="c-form-group" style="margin-top:10px;">
                <label style="display:block; margin-bottom:5px; font-weight:700; font-size:0.85rem;">Korea Address (Optional)</label>
                <input type="text" id="c-address" placeholder="For kit delivery" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;">
                <div class="c-form-group">
                    <label style="display:block; margin-bottom:5px; font-weight:700; font-size:0.85rem;">Arrival Date</label>
                    <input type="date" id="c-arrival" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
                </div>
                <div class="c-form-group">
                    <label style="display:block; margin-bottom:5px; font-weight:700; font-size:0.85rem;">Departure Date</label>
                    <input type="date" id="c-departure" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
                </div>
            </div>

            <div class="c-form-group" style="margin-top:10px;">
                <label style="display:block; margin-bottom:5px; font-weight:700; font-size:0.85rem;">Preferred 1-Week Period</label>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    <input type="date" id="c-period-start" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
                    <input type="date" id="c-period-end" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
                </div>
            </div>

            <div class="c-form-group" style="margin-top:10px;">
                <label style="display:block; margin-bottom:5px; font-weight:700; font-size:0.85rem;">Preferred Time</label>
                <div style="display:flex; gap:10px;">
                    <label style="flex:1; border:1px solid #ddd; padding:10px; text-align:center; border-radius:8px; cursor:pointer;"><input type="radio" name="c-time" value="AM" checked> AM</label>
                    <label style="flex:1; border:1px solid #ddd; padding:10px; text-align:center; border-radius:8px; cursor:pointer;"><input type="radio" name="c-time" value="PM"> PM</label>
                </div>
            </div>

            <div class="c-form-group" style="margin-top:10px;">
                <label style="display:block; margin-bottom:5px; font-weight:700; font-size:0.85rem;">Type of Checkup</label>
                <select id="c-type" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
                    <option value="종합검진">General (종합검진)</option>
                    <option value="기본 검사">Basic (기본 고해상)</option>
                    <option value="채용검진">Employment (채용/비자)</option>
                    <option value="단일항목">Single (대장내시경 등)</option>
                </select>
            </div>

            <div class="c-form-group" style="margin-top:10px;">
                <label style="display:block; margin-bottom:5px; font-weight:700; font-size:0.85rem;">Hospital Preference (희망 병원 유무)</label>
                <div style="display:flex; gap:10px; margin-bottom:10px;">
                    <label style="flex:1; border:1px solid #ddd; padding:10px; text-align:center; border-radius:8px; cursor:pointer;" onclick="document.getElementById('c-hospital-input-area').style.display='block'; document.getElementById('c-hospital-list-area').style.display='none';"><input type="radio" name="c-hospital-opt" value="Yes"> Yes</label>
                    <label style="flex:1; border:1px solid #ddd; padding:10px; text-align:center; border-radius:8px; cursor:pointer;" onclick="document.getElementById('c-hospital-input-area').style.display='none'; document.getElementById('c-hospital-list-area').style.display='block';"><input type="radio" name="c-hospital-opt" value="No" checked> No</label>
                </div>
                
                <div id="c-hospital-input-area" style="display:none;">
                    <input type="text" id="c-pref-hospital" placeholder="Enter preferred hospital name" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
                </div>
                
                <div id="c-hospital-list-area" style="display:block; background:#fff9db; padding:12px; border-radius:12px; border:1px solid #ffec99;">
                    <p style="font-size:0.8rem; color:#856404; margin-bottom:8px;">희망하시는 병원이 없으신가요? CHECKIT의 추천 리스트를 받아보시겠습니까?</p>
                    <button type="button" class="btn-block-primary" id="btn-request-list" style="background:#fcc419; color:#000; font-size:0.85rem; padding:8px 15px; width:100%;" onclick="this.classList.toggle('active'); this.innerText=this.classList.contains('active') ? '✓ List Requested' : 'Receive CHECKIT Recommendation List';">Receive CHECKIT Recommendation List</button>
                </div>
            </div>

            <div class="c-form-group" style="margin-top:10px;">
                <label style="display:block; margin-bottom:5px; font-weight:700; font-size:0.85rem;">Result Reception</label>
                <select id="c-reception" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
                    <option value="Email">Email (이메일)</option>
                    <option value="내원">Visit (내원)</option>
                    <option value="우편">Post (우편)</option>
                    <option value="Online">Online (온라인)</option>
                </select>
            </div>

            <div class="c-form-group" style="margin-top:10px;">
                <label style="display:block; margin-bottom:5px; font-weight:700; font-size:0.85rem;">Required Documents (Selection)</label>
                <select id="c-docs-select" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
                    <option value="영수증">영수증 (Receipt)</option>
                    <option value="검진확인서">검진확인서 (Confirmation)</option>
                    <option value="결과CD">결과CD (Result CD)</option>
                    <option value="영수증+확인서">영수증 + 확인서</option>
                    <option value="전체 (영수증+확인서+CD)">전체 (Receipt+Confirm+CD)</option>
                    <option value="기타">기타 직접 입력 (Other)</option>
                </select>
                <input type="text" id="c-docs-other" placeholder="Other specific requests..." style="width:100%; padding:8px; margin-top:8px; border-radius:8px; border:1px solid #ddd; font-size:0.85rem;">
            </div>

            <button type="button" class="btn-block-primary" style="width:100%; margin-top:15px; background:var(--primary); color:white; border:none; padding:15px; border-radius:12px; font-weight:800; cursor:pointer;" onclick="handleInlineFormSubmit()">Complete Registration</button>
        </div>
    `;
}

window.handleInlineFormSubmit = function() {
    const data = {
        name: document.getElementById('c-name').value,
        dob: document.getElementById('c-dob').value,
        phone: document.getElementById('c-phone').value,
        email: document.getElementById('c-email').value,
        arrival: document.getElementById('c-arrival').value,
        departure: document.getElementById('c-departure').value,
        period: `${document.getElementById('c-period-start').value} ~ ${document.getElementById('c-period-end').value}`,
        time: document.querySelector('input[name="c-time"]:checked').value,
        type: document.getElementById('c-type').value,
        reception: document.getElementById('c-reception').value,
        docs: document.getElementById('c-docs-select').value,
        docsOther: document.getElementById('c-docs-other').value,
        hospitalOpt: document.querySelector('input[name="c-hospital-opt"]:checked').value,
        prefHospital: document.getElementById('c-pref-hospital').value,
        requestList: document.getElementById('c-hospital-list-area').style.display === 'block'
    };

    // Combine docs select and other text
    let finalDocs = data.docs;
    if (data.docsOther) finalDocs += (finalDocs ? ', ' : '') + data.docsOther;

    if (!data.name || !data.dob || !data.phone || !data.email) {
        alert('Please fill out the essential fields.');
        return;
    }

    // 1. Send User Bubble (Rich Format)
    if (window.appendMessage) {
        window.appendMessage('user', generateConsultationSummaryHtml(data));
    }

    // 2. Hide Form Block
    const consultationBlock = document.getElementById('step-consultation');
    if (consultationBlock) consultationBlock.style.display = 'none';

    // 3. System Response & Trigger Next Step
    setTimeout(() => {
        if (window.appendMessage) {
            window.appendMessage('coord', `Thank you, <b>${data.name}</b>! I've received your request. I am now searching for hospitals that match your desired type (<b>${data.type}</b>).`);
        }

        // Trigger existing booking step
        if (typeof window.showChatBlock === 'function') {
            setTimeout(() => window.showChatBlock('booking'), 1500);
        }
    }, 1200);

    // Save locally
    localStorage.setItem('consultationData', JSON.stringify(data));
};
