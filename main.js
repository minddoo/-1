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
        client_id: "818434232492-checkit-43341.apps.googleusercontent.com", // Provided by user
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
        if (localStorage.getItem('isLoggedIn')) return;
        e.preventDefault();
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
                const passwordInput = form.querySelector('input[type="password"]');
                const displayName = nameInput ? nameInput.value : 'User';
                
                // Save state
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userName', displayName);
                
                // Update UI
                updateAuthUI();
                closeModal();
                
                // Reset form
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }, 1000);
        });
    });
}

function updateAuthUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userName = localStorage.getItem('userName') || 'User';
    const loginLink = document.getElementById('login-btn');

    if (isLoggedIn && loginLink) {
        loginLink.innerHTML = `<i class="fa-solid fa-user-circle"></i> ${userName}`;
        loginLink.style.background = 'rgba(46, 204, 113, 0.1)';
        loginLink.style.color = 'var(--primary)';
        loginLink.style.borderColor = 'var(--primary)';
        
        // Add logout option (simple alert for now)
        loginLink.onclick = (e) => {
            e.preventDefault();
            if (confirm('Would you like to log out?')) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userName');
                location.reload();
            }
        };
    }
}

// Initial UI Update Check
window.addEventListener('DOMContentLoaded', updateAuthUI);
