// Firebase Initialization
const firebaseConfig = {
    apiKey: "AIzaSyDAdW_vJHUHuDaun2Kh94uC8ywlfOdyPco",
    authDomain: "checkit-43341.firebaseapp.com",
    projectId: "checkit-43341",
    storageBucket: "checkit-43341.appspot.com",
    messagingSenderId: "818434232492",
    appId: "1:818434232492:web:713836b01fc11196150f09"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = typeof firebase !== 'undefined' ? firebase.firestore() : null;

// Sticky Header effect
const header = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Initialization for Landing Page Options
document.addEventListener('DOMContentLoaded', () => {
    const optInCheckbox = document.getElementById('unlimited-opt-in');
    const qtyInput = document.getElementById('product-qty');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const minusBtn = document.querySelector('.qty-btn.minus');
    const totalDisplay = document.getElementById('total-price-amount');
    const basePriceDisplay = document.getElementById('base-price-display');
    const mainImg = document.getElementById('main-product-image');

    function updateTotalPrice() {
        const basePrice = 300;
        const extraPrice = optInCheckbox && optInCheckbox.checked ? 30 : 0;
        const qty = qtyInput ? parseInt(qtyInput.value) : 1;
        const total = (basePrice + extraPrice) * qty;
        
        if (totalDisplay) totalDisplay.innerText = `$${total.toFixed(2)}`;
        if (basePriceDisplay) basePriceDisplay.innerText = `$${basePrice.toFixed(2)}`;
        
        // Save to localStorage for sync
        if (optInCheckbox) localStorage.setItem('unlimited_opt_in', optInCheckbox.checked);
    }

    if (optInCheckbox) {
        const isOptedIn = localStorage.getItem('unlimited_opt_in') === 'true';
        optInCheckbox.checked = isOptedIn;
        optInCheckbox.addEventListener('change', updateTotalPrice);
    }

    if (plusBtn && minusBtn && qtyInput) {
        plusBtn.addEventListener('click', () => {
            qtyInput.value = parseInt(qtyInput.value) + 1;
            updateTotalPrice();
        });
        minusBtn.addEventListener('click', () => {
            if (parseInt(qtyInput.value) > 1) {
                qtyInput.value = parseInt(qtyInput.value) - 1;
                updateTotalPrice();
            }
        });
    }

    // Cart and Wishlist Logic
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const wishlistBtn = document.getElementById('wishlist-btn');
    const cartCountBadge = document.querySelector('.cart-count');

    function updateCartUI() {
        const cart = JSON.parse(localStorage.getItem('checkit_cart') || '[]');
        if (cartCountBadge) {
            cartCountBadge.innerText = cart.length;
            cartCountBadge.style.display = cart.length > 0 ? 'flex' : 'none';
        }
    }

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const item = {
                id: 'total-safe-global-plan',
                name: 'Total-Safe Global Plan',
                price: 300,
                qty: parseInt(qtyInput.value),
                unlimitedChanges: optInCheckbox.checked,
                timestamp: new Date().getTime()
            };
            
            let cart = JSON.parse(localStorage.getItem('checkit_cart') || '[]');
            cart.push(item);
            localStorage.setItem('checkit_cart', JSON.stringify(cart));
            
            updateCartUI();
            alert('Added to cart successfully!');
        });
    }

    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const isWished = icon.classList.contains('fa-solid');
            
            if (isWished) {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
                icon.style.color = 'inherit';
                alert('Removed from wish list.');
            } else {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
                icon.style.color = '#e74c3c';
                alert('Added to wish list!');
            }
        });
    }

    // Header Icon Handlers
    const cartNav = document.getElementById('cart-nav');
    const wishlistNav = document.getElementById('wishlist-nav');

    if (cartNav) {
        cartNav.addEventListener('click', () => {
            const cart = JSON.parse(localStorage.getItem('checkit_cart') || '[]');
            if (cart.length === 0) {
                alert('Your cart is empty.');
            } else {
                let list = cart.map(item => `- ${item.name} (Qty: ${item.qty})`).join('\n');
                alert(`Current Cart Contents:\n\n${list}`);
            }
        });
    }

    // Contact Form Toggle
    const toggleEmailBtn = document.getElementById('toggle-email-form');
    const emailFormWrapper = document.getElementById('email-form-wrapper');

    // Q&A Accordion Toggle
    const qnaQuestions = document.querySelectorAll('.qna-question');
    qnaQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = item.querySelector('.qna-answer');
            const isActive = item.classList.contains('active');

            // Close other items
            document.querySelectorAll('.qna-item').forEach(qItem => {
                qItem.classList.remove('active');
                qItem.querySelector('.qna-answer').style.display = 'none';
            });

            if (!isActive) {
                item.classList.add('active');
                answer.style.display = 'block';
            }
        });
    });

    updateCartUI();


    updateTotalPrice();
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

// Hero Workflow Translations
const workflowTranslations = {
    'ko': {
        phase: '병원 및 프로그램 선정',
        steps: [
            '개인 맞춤형 프로필 생성 후<br><span class="highlight">전담 1:1 관리의 시작</span>',
            '24시간 채팅 상담 서비스 및<br><span class="highlight">전문 다국어 지원 모듈 기능</span>',
            '고객의 입출국 일자와<br><span class="highlight">희망 기간 및 상세 요구 파악</span>',
            '니즈에 적합한 병원 리스트와<br><span class="highlight">의료기관 즉시 확인 기능</span>',
            '병원별 프로그램 항목 비교와<br><span class="highlight">본인 맞춤형 검진 자동 매칭</span>',
            '최종 병원 및 프로그램 결정 후<br><span class="highlight">본격적인 예약 절차 진행</span>'
        ]
    },
    'en': {
        phase: 'Hospital & Program Selection',
        steps: [
            'Create a Personalized Profile<br><span class="highlight">Start 1:1 Professional Care</span>',
            '24H Chat-Based Consultation<br><span class="highlight">& Multilingual Support Service</span>',
            'Entrance & Departure Logistics<br><span class="highlight">Analyzing Detailed Requirements</span>',
            'Tailored Hospital & Program List<br><span class="highlight">Real-Time Availability Check</span>',
            'Comparing Specialized Programs<br><span class="highlight">Auto-Matching Your Best Fit</span>',
            'Finalize Selection & Decision<br><span class="highlight">Starting the Booking Support</span>'
        ]
    },
    'ja': {
        phase: '病院及びプログラム選定',
        steps: [
            '個別化されたプロフィールの作成<br><span class="highlight">1:1専任管理のスタート</span>',
            '24時間チャット相談および<br><span class="highlight">専門多言語支援モジュール</span>',
            '出入国の日程と<br><span class="highlight">希望期間および詳細要件の把握</span>',
            'ニーズに合った病院リストと<br><span class="highlight">医療機関の即時確認機能</span>',
            '病院別プログラムの比較と<br><span class="highlight">本人に合わせた検診マッチング</span>',
            '最終的な病院およびプログラムの選択<br><span class="highlight">本格的な予約手続きの開始</span>'
        ]
    },
    'zh-CN': {
        phase: '医院及项目选择',
        steps: [
            '创建个人定制档案<br><span class="highlight">开启 1:1 专属管理服务</span>',
            '24小时在线咨询服务<br><span class="highlight">及专业多语种支持模块</span>',
            '出入境日程及<br><span class="highlight">详细需求分析与评估</span>',
            '定制化医院及项目清单<br><span class="highlight">实时资源确认与对接</span>',
            '对比各院特色检查项目<br><span class="highlight">自动匹配最佳健康方案</span>',
            '敲定最终医院及项目<br><span class="highlight">启动正式预约行政支持</span>'
        ]
    },
    'vi': {
        phase: 'Lựa chọn Bệnh viện & Chương trình',
        steps: [
            'Tạo Hồ sơ Cá nhân hóa<br><span class="highlight">Bắt đầu Hỗ trợ 1:1 Chuyên nghiệp</span>',
            'Tư vấn qua Chat 24/7 và<br><span class="highlight">Mô-đun Hỗ trợ Đa ngôn ngữ</span>',
            'Lịch trình Nhập cảnh/Xuất cảnh<br><span class="highlight">Phân tích Yêu cầu Chi tiết</span>',
            'Danh sách Bệnh viện Phù hợp<br><span class="highlight">Kiểm tra Trạng thái Thời gian Thực</span>',
            'So sánh Các Chương trình Khám<br><span class="highlight">Tự động Khớp với Nhu cầu</span>',
            'Chốt Bệnh viện & Chương trình<br><span class="highlight">Bắt đầu Quy trình Đặt lịch</span>'
        ]
    },
    'th': {
        phase: 'การเลือกโรงพยาบาลและโปรแกรม',
        steps: [
            'สร้างโปรไฟล์ส่วนบุคคล<br><span class="highlight">เริ่มต้นการดูแลแบบ 1:1</span>',
            'ให้คำปรึกษาผ่านแชท 24 ชม.<br><span class="highlight">และโมดูลรองรับหลายภาษา</span>',
            'กำหนดการเดินทางและ<br><span class="highlight">การวิเคราะห์ความต้องการเชิงลึก</span>',
            'รายการโรงพยาบาลที่เหมาะสม<br><span class="highlight">ตรวจสอบพิกัดได้แบบเรียลไทม์</span>',
            'เปรียบเทียบรายการโปรแกรมตรวจ<br><span class="highlight">จับคู่สิ่งที่เหมาะสมกับคุณที่สุด</span>',
            'ยืนยันโรงพยาบาลและโปรแกรม<br><span class="highlight">เริ่มขั้นตอนการจองอย่างเป็นทางการ</span>'
        ]
    },
    'ru': {
        phase: 'Выбор клиники и программы',
        steps: [
            'Создание личного профиля<br><span class="highlight">Начало персонального сопровождения</span>',
            'Круглосуточный чат-сервис и<br><span class="highlight">многоязычный модуль поддержки</span>',
            'График прилета и вылета,<br><span class="highlight">анализ детальных требований</span>',
            'Список подходящих клиник<br><span class="highlight">Мгновенная проверка доступности</span>',
            'Сравнение медицинских программ<br><span class="highlight">Авто-подбор под ваши нужды</span>',
            'Финальный выбор клиники<br><span class="highlight">Запуск процедуры бронирования</span>'
        ]
    }
};

function updateWorkflowContent(langCode) {
    const data = workflowTranslations[langCode] || workflowTranslations['en'];
    
    // Update Phase
    const phaseTitle = document.querySelector('.phase-title');
    if (phaseTitle) phaseTitle.innerText = data.phase;
    
    // Update Step H2s
    const stepItems = document.querySelectorAll('.step-item');
    stepItems.forEach((item, index) => {
        const h2 = item.querySelector('h2');
        if (h2 && data.steps[index]) {
            h2.innerHTML = data.steps[index];
        }
    });
}

function changeLanguage(langCode) {
    // 1. Set the Google Translate Cookie
    const cookieValue = (langCode === 'en') ? '/en/en' : `/en/${langCode}`;
    setCookie('googtrans', cookieValue, 1);

    // 2. Update Document Lang Attribute
    document.documentElement.lang = langCode;

    // 3. Update Native Content instantly
    updateLegalContent(langCode);
    updateWelcomeMessage(langCode);
    updateWorkflowContent(langCode); // Manual high-quality Hero translation

    // 4. Trigger Google Translate Engine for the rest of the page
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
        } else {
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
    
    // Update native translation fields immediately
    updateLegalContent(savedLang);
    updateWelcomeMessage(savedLang);
    updateWorkflowContent(savedLang);

    if (savedLang !== 'en') {
        const cookieValue = `/en/${savedLang}`;
        setCookie('googtrans', cookieValue, 1);
        setTimeout(() => changeLanguage(savedLang), 1000);
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
// Hero Workflow Slider (6-Steps)
const heroDots = document.querySelectorAll('.hero-dot');
const stepItems = document.querySelectorAll('.step-item');
const imageTrack = document.querySelector('.image-slider-track');
let currentHeroStep = 0;
const totalHeroSteps = stepItems.length;

if (stepItems.length > 0) {
    function updateHeroStep(index) {
        // Update Dots
        heroDots.forEach(dot => dot.classList.remove('active'));
        if (heroDots[index]) heroDots[index].classList.add('active');

        // Update Text Items
        stepItems.forEach(item => item.classList.remove('active'));
        if (stepItems[index]) stepItems[index].classList.add('active');

        // Update Image Items (One by one, no sliding)
        const imgSlides = document.querySelectorAll('.img-slide');
        imgSlides.forEach(slide => slide.classList.remove('active'));
        if (imgSlides[index]) imgSlides[index].classList.add('active');
        
        currentHeroStep = index;
    }

    function nextHeroStep() {
        let n = (currentHeroStep + 1) % totalHeroSteps;
        updateHeroStep(n);
    }

    // Auto-play every 6 seconds for better readability
    let heroInterval = setInterval(nextHeroStep, 6000);

    // Dot Clicks
    heroDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateHeroStep(index);
            clearInterval(heroInterval);
            heroInterval = setInterval(nextHeroStep, 6000);
        });
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
        // [MASTER ACCOUNT REDIRECTION]
        if (user.email === "master@checkit.com" || user.email === "checkit082082@gmail.com") {
            window.location.href = 'master_dashboard.html';
            return;
        }

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

    // Master / Corporate Login Submission
    const corporateForm = document.getElementById('corporate-form');
    if (corporateForm) {
        corporateForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Corporate Login attempt...");
            const companyKey = document.getElementById('corp-company-key').value.trim();
            const securityKey = document.getElementById('corp-security-key').value.trim();

            const isMaster = (companyKey.toLowerCase() === 'comp_체킷' && (securityKey === 'checkit03080!!' || securityKey === 'checkit082082!'));

            if (isMaster) {
                try {
                    const masterEmail = "master@checkit.com";
                    const masterPw = "master1234!";
                    // Sign in to Firebase
                    await firebase.auth().signInWithEmailAndPassword(masterEmail, masterPw);
                    
                    // Save session flag for UI consistency
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userName', 'Master Admin');
                    localStorage.setItem('userEmail', masterEmail);
                    
                    // Redirect to specialized B2C Master Dashboard
                    window.location.href = 'master_dashboard.html';
                } catch (err) {
                    console.error("Master Login Error:", err);
                    alert("Authentication error: " + err.message);
                }
            } else {
                alert("Incorrect Company Key or Security Key. Access Denied.");
            }
        });
    }

    // Mock Form Submission
    authForms.forEach(form => {
        if (form.id === 'corporate-form') return; // Handled separately
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
    const blogView = document.getElementById('blog-view');
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
        
        if (blogView) {
            blogView.classList.add('hidden-view');
            blogView.style.display = 'none';
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
        if (blogView) {
            blogView.classList.add('hidden-view');
            blogView.style.display = 'none';
        }
    } else if (viewName === 'blog') {
        // Show global navbar
        if (navbar) navbar.style.display = 'block';
        
        if (homeView) {
            homeView.classList.add('hidden-view');
            homeView.style.display = 'none';
        }
        if (mypageView) {
            mypageView.classList.add('hidden-view');
            mypageView.style.display = 'none';
        }
        if (blogView) {
            blogView.classList.remove('hidden-view');
            blogView.style.display = 'block';
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
                        url: "https://sev.severance.healthcare/sev/patient-carer/appointment/checkup/checkup-program.do",
                        categories: [
                            {
                                name: "종합검진 (Comprehensive)",
                                icon: "fa-clipboard-check",
                                programs: [
                                    { 
                                        title: "기본종합검진", 
                                        details: {
                                            "신체계측": [
                                                "신장, 체중, 인바디, 허리둘레"
                                            ],
                                            "혈액검사": [
                                                "빈혈, 대사 (당, 지질, 전해질, Vitamin D)",
                                                "기능 (간, 신장, 갑상선)",
                                                "혈청 (에이즈, 매독, 류마티스, A형 간염, B형 간염, C형 간염)",
                                                "종양표지자 (간, 췌장, 대장, 폐 ①, 전립선 ①)",
                                                "난소 ①, 유방 ①"
                                            ],
                                            "소변검사": [
                                                "요당, 단백뇨, 혈뇨"
                                            ],
                                            "대변검사": [
                                                "잠혈, 기생충"
                                            ],
                                            "치과검사": [
                                                "치과 진찰"
                                            ],
                                            "안과검사": [
                                                "시력, 안압, 안저"
                                            ],
                                            "청력검사": [
                                                "순음청력 (만 50세 이상)"
                                            ],
                                            "심장검사": [
                                                "혈압 측정, 심전도"
                                            ],
                                            "호흡기검사": [
                                                "흉부 X선"
                                            ],
                                            "복부검사": [
                                                "복부 초음파 (간, 담낭, 췌장, 신장, 비장병변)"
                                            ],
                                            "소화기검사": [
                                                "위내시경 (전정(수면)내시경 시 13만원 추가, 보호자 동반, 자가운전 불가)"
                                            ],
                                            "유방검사": [
                                                "유방 X선 (만 35세 이상)"
                                            ],
                                            "부인과검사": [
                                                "부인과 진찰, 액상 자궁경부암 검사"
                                            ],
                                            "영양": [
                                                "식습관 설문 조사"
                                            ],
                                            "결과상담": [
                                                "방문 상담 (전화, E-Mail, 우편 가능)"
                                            ]
                                        }
                                    },
                                    { 
                                        title: "프리미엄검진", 
                                        details: {
                                            "신체계측": ["신장, 체중, 인바디, 허리둘레"],
                                            "혈액검사": [
                                                "빈혈, 대사 (당, 지질, 전해질, Vitamin D)",
                                                "기능 (간, 신장, 갑상선)",
                                                "혈청 (에이즈, 매독, 류마티스, A형 간염, B형 간염, C형 간염)",
                                                "종양표지자 (간, 췌장, 대장, 폐 ①, 전립선 ①)",
                                                "난소 ①, 유방 ①"
                                            ],
                                            "소변검사": ["요당, 단백뇨, 혈뇨"],
                                            "대변검사": ["잠혈, 기생충"],
                                            "치과검사": ["치과 진찰"],
                                            "안과검사": ["시력, 안압, 안저"],
                                            "청력검사": ["순음청력 (만 50세 이상)"],
                                            "심장검사": ["혈압 측정, 심전도"],
                                            "호흡기검사": ["흉부 X선"],
                                            "복부검사": ["복부 초음파 (간, 담낭, 췌장, 신장, 비장병변)"],
                                            "소화기검사": ["위내시경 (전정(수면)내시경 시 13만원 추가, 보호자 동반, 자가운전 불가)"],
                                            "유방검사": ["유방 X선 (만 35세 이상)"],
                                            "부인과검사": ["부인과 진찰, 액상 자궁경부암 검사"],
                                            "영양": ["식습관 설문 조사"],
                                            "결과상담": ["방문 상담 (전화, E-Mail, 우편 가능)"],
                                            "남·여공통 (프리미엄 추가)": [
                                                "대장내시경",
                                                "진정(수면)내시경",
                                                "복부 CT",
                                                "간 섬유화·지방 스캔",
                                                "저선량 폐 CT",
                                                "관상동맥 석회화 CT",
                                                "동맥경화 협착도",
                                                "갑상선 초음파",
                                                "골밀도",
                                                "근골격 불균형·부정렬"
                                            ],
                                            "남성 추가 항목": ["남성호르몬 (혈액)"],
                                            "여성 추가 항목": ["유방 초음파", "부인과 초음파", "인유두종 바이러스", "여성호르몬 (혈액)"]
                                        }
                                    },
                                    { 
                                        title: "플래티넘검진", 
                                        details: {
                                            "신체계측": ["신장, 체중, 인바디, 허리둘레"],
                                            "혈액검사": [
                                                "빈혈, 대사 (당, 지질, 전해질, Vitamin D)",
                                                "기능 (간, 신장, 갑상선)",
                                                "혈청 (에이즈, 매독, 류마티스, A형 간염, B형 간염, C형 간염)",
                                                "종양표지자 (간, 췌장, 대장, 폐 ①, 전립선 ①)",
                                                "난소 ①, 유방 ①"
                                            ],
                                            "소변검사": ["요당, 단백뇨, 혈뇨"],
                                            "대변검사": ["잠혈, 기생충"],
                                            "치과검사": ["치과 진찰"],
                                            "안과검사": ["시력, 안압, 안저"],
                                            "청력검사": ["순음청력 (만 50세 이상)"],
                                            "심장검사": ["혈압 측정, 심전도"],
                                            "호흡기검사": ["흉부 X선"],
                                            "복부검사": ["복부 초음파 (간, 담낭, 췌장, 신장, 비장병변)"],
                                            "소화기검사": ["위내시경 (전정(수면)내시경 시 13만원 추가, 보호자 동반, 자가운전 불가)"],
                                            "유방검사": ["유방 X선 (만 35세 이상)"],
                                            "부인과검사": ["부인과 진찰, 액상 자궁경부암 검사"],
                                            "영양": ["식습관 설문 조사"],
                                            "결과상담": ["방문 상담 (전화, E-Mail, 우편 가능)"],
                                            "프리미엄 추가 항목": [
                                                "대장내시경",
                                                "진정(수면)내시경",
                                                "복부 CT",
                                                "간 섬유화·지방 스캔",
                                                "저선량 폐 CT",
                                                "관상동맥 석회화 CT",
                                                "동맥경화 협착도",
                                                "갑상선 초음파",
                                                "골밀도",
                                                "근골격 불균형·부정렬",
                                                "남성호르몬(남) 또는 유방/부인과초음파/HPV/여성호르몬(여)"
                                            ],
                                            "남·여공통 (플래티넘 추가)": [
                                                "뇌 MRI + MRA",
                                                "경동맥 초음파",
                                                "심장 초음파"
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    },

                    { 
                        name: "세란병원 센터", 
                        loc: "서울(종로/독립문)", 
                        url: "https://seran.co.kr/index.php/html/488",
                        categories: [
                            {
                                name: "종합검진 (Comprehensive)",
                                icon: "fa-clipboard-check",
                                programs: [
                                    { 
                                        title: "베이직", 
                                        details: {
                                            "전문의 상담": ["전문의 상담, 과거력 및 현재 상태 상담"],
                                            "신체계측": ["신장, 체중, 비만도, 체성분 분석"],
                                            "청력, 안과": ["청력, 시력, 안압, 안저"],
                                            "심장검사": ["혈압, 맥박, 심전도"],
                                            "호흡기검사": ["폐기능, 흉부 X-Ray"],
                                            "혈액, 소변검사": [
                                                "혈액질환, 빈혈, 갑상선기능, 당뇨, 신장 기능, 간기능",
                                                "고지혈증, 요산, 전해질, 류마티스인자, 췌장질환",
                                                "간염 검사(A, B, C형), 매독, 에이즈, 심장효소, 염증검사",
                                                "종양표지자(간암, 소화기암, 췌장암, 전립선, 난소)",
                                                "일반소변검사 및 현미경검사"
                                            ],
                                            "초음파 검사": [
                                                "상복부(간, 담낭, 췌장, 비장, 신장)",
                                                "하복부(전립선, 자궁, 난소)"
                                            ],
                                            "여성검사": [
                                                "자궁경부암 (pap smear)",
                                                "유방촬영 (Mammography)"
                                            ],
                                            "소화기검사": [
                                                "수면 위내시경 (일반 위내시경 or 위장 조영촬영으로 변경 가능)"
                                            ]
                                        }
                                    },
                                    { 
                                        title: "그린", 
                                        details: {
                                            "전문의 상담": ["전문의 상담, 과거력 및 현재 상태 상담"],
                                            "신체계측": ["신장, 체중, 비만도, 체성분 분석, 생체나이분석"],
                                            "청력, 안과": ["청력, 시력, 안압, 안저"],
                                            "심장검사": ["혈압, 맥박, 심전도"],
                                            "호흡기검사": ["폐기능, 흉부 X-Ray"],
                                            "혈액, 소변검사": [
                                                "혈액질환, 빈혈, 갑상선기능, 당뇨, 신장 기능, 간기능",
                                                "고지혈증, 요산, 전해질, 류마티스인자, 췌장질환",
                                                "간염 검사(A, B, C형), 매독, 에이즈, 심장효소, 염증검사",
                                                "종양표지자(간암, 소화기암, 췌장암, 전립선, 난소)",
                                                "일반소변검사 및 현미경검사"
                                            ],
                                            "초음파 검사": [
                                                "상복부(간, 담낭, 췌장, 비장, 신장)",
                                                "하복부(전립선, 자궁, 난소)",
                                                "갑상선 초음파"
                                            ],
                                            "여성검사": [
                                                "자궁경부암 (pap smear)",
                                                "유방촬영 (Mammography)"
                                            ],
                                            "기타 정밀": [
                                                "골다공증검사 (골밀도 검사)",
                                                "동맥경화검사 (동맥경화도)"
                                            ],
                                            "소화기검사": [
                                                "수면 위내시경 (일반 위내시경 or 위장 조영촬영으로 변경 가능)"
                                            ],
                                            "A선택 (택 1)": [
                                                "뇌 CT / 저선량 폐 CT / 경추 CT / 요추 CT",
                                                "부비동 CT / 복부체지방 CT / 심장 관상동맥 석회화 CT",
                                                "녹내장 및 안구건조증검사 (OCT, VR시야검사, 눈물띠 높이측정)"
                                            ]
                                        }
                                    },
                                    { 
                                        title: "블루", 
                                        details: {
                                            "전문의 상담": ["전문의 상담, 과거력 및 현재 상태 상담"],
                                            "신체계측": [
                                                "신장, 체중, 비만도, 체성분 분석, 생체나이분석",
                                                "청력, 시력, 안압, 안저"
                                            ],
                                            "심장/호흡기": ["혈압, 맥박, 심전도, 폐기능, 흉부 X-Ray"],
                                            "혈액, 소변검사": [
                                                "혈액질환, 빈혈, 갑상선기능, 당뇨, 신장 기능, 간기능",
                                                "고지혈증, 요산, 전해질, 류마티스인자, 췌장질환",
                                                "간염 검사(A, B, C형), 매독, 에이즈, 심장효소, 염증검사",
                                                "종양표지자(간암, 소화기암, 췌장암, 전립선, 난소)",
                                                "일반소변검사 및 현미경검사"
                                            ],
                                            "초음파 검사": [
                                                "상복부(간, 담낭, 췌장, 비장, 신장)",
                                                "하복부(전립선, 자궁, 난소)",
                                                "갑상선 초음파, 경동맥 초음파"
                                            ],
                                            "기타 정밀": [
                                                "여성검사 (자궁경부암, 유방촬영)",
                                                "골다공증검사 (골밀도)",
                                                "동맥경화검사 (동맥경화도)"
                                            ],
                                            "소화기검사": [
                                                "수면 위내시경 (일반 위내시경 or 위장 조영촬영으로 변경 가능)"
                                            ],
                                            "A선택 (택 2)": [
                                                "뇌/폐/경추/요추/부비동/복부체지방/심장석회화 CT",
                                                "뇌혈류 초음파, 유방 초음파",
                                                "유전적 질병예측분석 5종 (남성암/여성암/일반질환 중 택1)",
                                                "녹내장 및 안구건조증검사 (OCT, VR시야검사, 눈물띠 높이측정)"
                                            ],
                                            "B선택 (택 1)": [
                                                "뇌 MRI",
                                                "뇌혈관 MRA",
                                                "수면 대장 내시경"
                                            ]
                                        }
                                    },
                                    { 
                                        title: "실버", 
                                        details: {
                                            "전문의 상담": ["전문의 상담, 과거력 및 현재 상태 상담"],
                                            "신체계측": [
                                                "신장, 체중, 비만도, 체성분 분석, 생체나이분석",
                                                "청력, 시력, 안압, 안저"
                                            ],
                                            "심장/호흡기": ["혈압, 맥박, 심전도, 폐기능, 흉부 X-Ray"],
                                            "혈액, 소변검사": [
                                                "혈액질환, 빈혈, 갑상선기능, 당뇨, 신장 기능, 간기능",
                                                "고지혈증, 요산, 전해질, 류마티스인자, 췌장질환",
                                                "간염 검사(A, B, C형), 매독, 에이즈, 심장효소, 염증검사",
                                                "종양표지자(간암, 소화기암, 췌장암, 전립선, 난소)",
                                                "일반소변검사 및 현미경검사"
                                            ],
                                            "특수혈액검사": [
                                                "종양표지자 (혈액암, 폐암, 유방암)",
                                                "비타민 D, 호모시스테인"
                                            ],
                                            "초음파 검사": [
                                                "상복부(간, 담낭, 췌장, 비장, 신장)",
                                                "하복부(전립선, 자궁, 난소)",
                                                "갑상선 초음파, 경동맥 초음파"
                                            ],
                                            "특수 초음파": [
                                                "뇌혈류 초음파",
                                                "유방 초음파 (여)"
                                            ],
                                            "기타 정밀": [
                                                "여성검사 (자궁경부암, 유방촬영)",
                                                "골다공증검사 (골밀도)",
                                                "동맥경화검사 (동맥경화도)"
                                            ],
                                            "소화기검사": [
                                                "수면 위내시경",
                                                "수면 대장내시경"
                                            ],
                                            "A선택 (택 1)": [
                                                "뇌/폐/경추/요추/부비동/복부체지방/심장석회화 CT",
                                                "유전적 질병예측분석 5종 (남성암/여성암/일반질환 중 택1)",
                                                "녹내장 및 안구건조증검사 (OCT, VR시야검사, 눈물띠 높이측정)"
                                            ],
                                            "B선택 (택 1)": [
                                                "뇌 MRI",
                                                "뇌혈관 MRA"
                                            ]
                                        }
                                    },
                                    { 
                                        title: "골드", 
                                        details: {
                                            "전문의 상담": ["전문의 상담, 과거력 및 현재 상태 상담"],
                                            "신체계측": [
                                                "신장, 체중, 비만도, 체성분 분석, 생체나이분석",
                                                "청력, 시력, 안압, 안저"
                                            ],
                                            "심장/호흡기": ["혈압, 맥박, 심전도, 폐기능, 흉부 X-Ray"],
                                            "혈액/소변/특수혈액": [
                                                "혈액질환, 빈혈, 당뇨, 간/신장/갑상선 기능 정밀",
                                                "간염(A,B,C형), 매독, 에이즈, 심장효소, 염증검사",
                                                "종양표지자(간,소화기,췌장,전립선,난소,혈액,폐,유방)",
                                                "비타민 D, 호모시스테인, 호르몬검사(남/여)",
                                                "일반소변검사 및 현미경검사"
                                            ],
                                            "일반/특수 초음파": [
                                                "상복부(간,담낭,췌장,비장,신장), 하복부(전립선,자궁,난소)",
                                                "갑상선, 경동맥, 뇌혈류, 유방(여), 심장 초음파"
                                            ],
                                            "정밀 검사": [
                                                "여성검사(자궁경부암, 유방촬영, HPV검사)",
                                                "골밀도 검사, 동맥경화도, 스트레스 검사"
                                            ],
                                            "소화기검사": ["수면 위내시경, 수면 대장내시경"],
                                            "뇌 정밀 검사": ["뇌 MRI, 뇌혈관 MRA"],
                                            "A선택 (택 1)": [
                                                "저선량 폐 CT / 경추 CT / 요추 CT / 부비동 CT",
                                                "복부체지방 CT / 심장 관상동맥 석회화 CT",
                                                "유전적 질병예측분석 5종 (남성암/여성암/일반질환 중 택1)",
                                                "녹내장 및 안구건조증검사 (OCT, VR시야검사, 눈물띠 높이측정)"
                                            ]
                                        }
                                    },
                                    { 
                                        title: "크리스탈", 
                                        details: {
                                            "전문의 상담": ["전문의 상담, 과거력 및 현재 상태 상담"],
                                            "신체계측": [
                                                "신장, 체중, 비만도, 체성분 분석, 생체나이분석",
                                                "청력, 시력, 안압, 안저"
                                            ],
                                            "심장/호흡기": [
                                                "혈압, 맥박, 심전도, 폐기능, 흉부 X-Ray",
                                                "저선량 폐 CT (기본 포함)"
                                            ],
                                            "혈액/소변/특수혈액": [
                                                "혈액질환, 빈혈, 당뇨, 간/신장/갑상선 기능 정밀",
                                                "간염(A,B,C형), 매독, 에이즈, 심장효소, 염증검사",
                                                "종양표지자(간,소화기,췌장,전립선,난소,혈액,폐,유방)",
                                                "비타민 D, 호모시스테인, 호르몬검사(남/여)",
                                                "일반소변검사 및 현미경검사"
                                            ],
                                            "일반/특수 초음파": [
                                                "상복부(간,담낭,췌장,비장,신장), 하복부(전립선,자궁,난소)",
                                                "갑상선, 경동맥, 뇌혈류, 유방(여), 심장 초음파"
                                            ],
                                            "여성/골밀도/정밀": [
                                                "자궁경부암, 유방촬영, HPV검사, 액상세포진검사",
                                                "골밀도 검사, 동맥경화도, 혈액점도검사",
                                                "스트레스 검사 (심박변이)"
                                            ],
                                            "소화기/뇌 정밀": [
                                                "수면 위내시경, 수면 대장내시경",
                                                "뇌 MRI, 뇌혈관 MRA"
                                            ],
                                            "특화 서비스": [
                                                "유전적 질병예측분석 10종 (남성암/여성암/일반질환)",
                                                "뷰티시술: 화이트닝 레이저시술, 비타민 관리"
                                            ],
                                            "A선택 (택 1)": [
                                                "경추 CT / 요추 CT / 부비동 CT / 복부체지방 CT",
                                                "심장 관상동맥 석회화 CT",
                                                "녹내장 및 안구건조증검사 (OCT, VR시야검사, 눈물띠 높이측정)"
                                            ],
                                            "B선택 (택 1)": [
                                                "복부 MR CP (자기공명 담췌관조영술)",
                                                "경추 MRI / 요추 MRI",
                                                "어깨 MRI (편측) / 무릎 MRI (편측)"
                                            ]
                                        }
                                    },
                                    { 
                                        title: "크리스탈 PET-CT", 
                                        details: {
                                            "전문의 상담": ["전문의 상담, 과거력 및 현재 상태 상담"],
                                            "신체계측 / 안과 / 청력": [
                                                "신장, 체중, 비만도, 체성분 분석, 생체나이분석",
                                                "청력, 시력, 안압, 안저",
                                                "녹내장 및 안구건조증검사 (OCT, VR시야검사 등)"
                                            ],
                                            "전신암 정밀 검진": ["PET-CT (뇌+전신) 암 검진"],
                                            "특수 정밀 검사": [
                                                "MAST 알러지 108종 항체 검사",
                                                "심전도 홀터검사 (24시간 집중 체크)"
                                            ],
                                            "심장/호흡기/소화기": [
                                                "혈압, 맥박, 심전도, 폐기능, 흉부 X-Ray",
                                                "수면 위내시경, 수면 대장내시경"
                                            ],
                                            "혈액/소변/특수혈액": [
                                                "종양표지자 풀 패키지 (간,췌장,전립선,난소,혈액,폐,유방 등)",
                                                "비타민 D, 호모시스테인, 호르몬검사(남/여)",
                                                "간/신장/갑상선 기능 및 각종 혈액 질환 정밀"
                                            ],
                                            "초음파 풀 패키지": [
                                                "상복부, 하복부, 갑상선, 경동맥, 뇌혈류, 유방(여), 심장 초음파"
                                            ],
                                            "정밀 검사": [
                                                "여성검사(HPV, 액상세포진 포함), 골밀도, 동맥경화도",
                                                "심박변이 스트레스 검사, 혈액점도검사"
                                            ],
                                            "뇌 정밀 / 유전자 / 뷰티": [
                                                "뇌 MRI, 뇌혈관 MRA",
                                                "유전적 질병예측분석 10종 (남성암/여성암/일반질환)",
                                                "화이트닝 레이저시술, 비타민 관리"
                                            ],
                                            "MR 선택 (택 1)": [
                                                "복부 MR CP (자기공명 담췌관조영술)",
                                                "경추 MRI / 요추 MRI",
                                                "어깨 MRI (편측) / 무릎 MRI (편측)"
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ];

                blockHtml = `
                    <div class="msg-bubble hospital-integrated-card" style="background: white; border-radius: 12px; padding: 20px; border: 1px solid #edf2f7; width: 92%; align-self: flex-start; box-shadow: var(--shadow-sm);">
                        <div class="hospital-notice-box" style="margin-bottom: 20px; padding: 14px; background: #f8fafc; border-radius: 10px; border-left: 4px solid var(--primary);">
                            <p style="margin: 0 0 8px 0; font-size: 0.8rem; color: #475569; line-height: 1.5;">
                                <i class="fa-solid fa-circle-info" style="color: var(--primary); margin-right: 6px;"></i>
                                의료기관의 검진 프로그램 및 비용은 주기적으로 변경될 수 있습니다. CHECKIT에서 제공하는 정보는 실제와 다소 차이가 있을 수 있으니, 정확한 내용은 홈페이지를 통해 한 번 더 확인해 주시기 바랍니다.
                            </p>
                            <p style="margin: 0; font-size: 0.8rem; color: var(--primary); font-weight: 600;">
                                <i class="fa-solid fa-arrow-pointer" style="margin-right: 6px;"></i>
                                '정보 보기' 버튼을 클릭하시면 해당 의료기관의 상세 프로그램과 항목을 즉시 확인하실 수 있습니다.
                            </p>
                        </div>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            ${hospitals.map((h, i) => {
                                const proxyUrl = h.url;
                                const hospitalId = `hospital-${i}`;
                                return `
                                        <li id="li-hospital-${i}" class="hospital-list-item" style="padding: 12px 10px; border-bottom: ${i === hospitals.length - 1 ? 'none' : '1px solid #f1f5f9'}; border-radius: 12px; transition: var(--transition); cursor: pointer;" onclick="toggleHospitalPrograms('${hospitalId}')">
                                            <div class="" style="font-weight: 800; color: var(--text-dark); font-size: 0.95rem; margin-bottom: 4px;">${h.name}</div>
                                            <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 8px;"><i class="fa-solid fa-location-dot" style="margin-right:4px;"></i>${h.loc}</div>
                                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                                <!-- Row 1: Hospital Details & Selection -->
                                                <div style="display: flex; gap: 6px; align-items: center; justify-content: flex-start;">
                                                    <a href="${proxyUrl}" target="_blank" onclick="event.stopPropagation()" style="display: inline-flex; align-items: center; justify-content: center; padding: 0 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; color: #475569; text-decoration: none; font-size: 0.7rem; font-weight: 700; height: 38px; white-space: nowrap;">
                                                        <i class="fa-solid fa-circle-info" style="margin-right:4px;"></i>View Information
                                                    </a>
                                                    <button class="btn-toggle-programs" style="padding: 0 10px; font-size: 0.7rem; height: 38px; font-weight: 700; white-space: nowrap; display: inline-flex; align-items: center; justify-content: center;" onclick="event.stopPropagation(); toggleHospitalPrograms('${hospitalId}')">
                                                        Examination items
                                                    </button>
                                                    <button class="btn-select-hospital" style="padding: 0 10px; font-size: 0.7rem; height: 38px; font-weight: 700; white-space: nowrap; display: inline-flex; align-items: center; justify-content: center;" onclick="event.stopPropagation(); selectHospital(${i}, '${hospitalId}')">
                                                        Hospital Selection
                                                    </button>
                                                </div>
                                                <!-- Row 2: Search Shortcuts (Compacted) -->
                                                <div style="display: flex; gap: 6px; justify-content: flex-start;">
                                                    <a href="https://search.naver.com/search.naver?query=${encodeURIComponent(h.name)}" target="_blank" onclick="event.stopPropagation()" style="display: inline-flex; align-items: center; justify-content: center; padding: 0 12px; background: #03C75A; border: 1px solid #03C75A; border-radius: 8px; color: white; text-decoration: none; font-size: 0.75rem; font-weight: 700; height: 36px; min-width: 100px;">
                                                        <i class="fa-solid fa-n" style="margin-right:6px; font-size: 0.7rem;"></i>Naver
                                                    </a>
                                                    <a href="https://www.google.com/search?q=${encodeURIComponent(h.name)}" target="_blank" onclick="event.stopPropagation()" style="display: inline-flex; align-items: center; justify-content: center; padding: 0 12px; background: #4285F4; border: 1px solid #4285F4; border-radius: 8px; color: white; text-decoration: none; font-size: 0.75rem; font-weight: 700; height: 36px; min-width: 100px;">
                                                        <i class="fa-solid fa-g" style="margin-right:6px; font-size: 0.7rem;"></i>Google
                                                    </a>
                                                </div>
                                            </div>
                                        
                                        <div id="${hospitalId}" class="hospital-programs">
                                            ${h.categories.map((cat, catIdx) => `
                                                <div class="program-category-group">
                                                    <div class="category-label"><i class="fa-solid ${cat.icon || 'fa-clipboard-check'}"></i> ${cat.name}</div>
                                                    <div class="program-tags-container">
                                                        ${cat.programs.map((p, pIdx) => `
                                                            <div class="program-item-chip" onclick="event.stopPropagation(); openProgramModal(${i}, ${catIdx}, ${pIdx})">
                                                                <span class="chip-title ">${p.title}</span>
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
            case 'change-request':
                const changeCount = parseInt(localStorage.getItem('changeCount') || '0');
                const isUnlimited = localStorage.getItem('isUnlimited') === 'true';
                const isOptedIn = localStorage.getItem('unlimited_opt_in') === 'true';
                
                welcomeText = "일정 변경 및 추가 항목 요청 서비스입니다. 원하시는 변경 사항을 말씀해 주세요.";
                
                if (isUnlimited) {
                    blockHtml = `
                        <div class="system-block" style="border-left: 4px solid var(--primary); background: linear-gradient(to right, #f0fdf4, #ffffff);">
                            <div class="block-icon" style="background: rgba(46, 204, 113, 0.2);"><i class="fa-solid fa-crown" style="color: #f1c40f;"></i></div>
                            <div class="block-content">
                                <p><strong style="color: var(--primary);">무제한 변경 모드 활성화됨</strong></p>
                                <span style="color: #475569;">고객님은 프리미엄 무제한 변경 권한을 보유하고 계십니다.</span>
                                <div class="block-actions">
                                    <button class="btn-block-primary" onclick="window.processChangeRequest()" style="box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);">새로운 변경 요청하기</button>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (changeCount < 3) {
                    const remaining = 3 - changeCount;
                    blockHtml = `
                        <div class="system-block" style="border-left: 4px solid #3498db;">
                            <div class="block-icon" style="background: rgba(52, 152, 219, 0.1); color: #3498db;"><i class="fa-solid fa-calendar-plus"></i></div>
                            <div class="block-content">
                                <p><strong>일정 및 항목 변경 요청</strong></p>
                                <span>현재 <b style="color: #3498db;">${changeCount}/3회</b> 무료 요청을 사용하셨습니다.</span>
                                <div class="block-actions">
                                    <button class="btn-block-primary" onclick="window.processChangeRequest()" style="background: #3498db;">변경 요청하기 (잔여: ${remaining}회)</button>
                                </div>
                                ${!isOptedIn ? `
                                <div style="margin-top: 15px; padding: 10px; background: #f8fafc; border-radius: 8px; font-size: 0.8rem;">
                                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                        <input type="checkbox" onchange="localStorage.setItem('unlimited_opt_in', this.checked); window.showChatBlock('change-request')" style="accent-color: var(--primary);">
                                        <span>3회 초과 시 무제한 옵션($30) 미리 선택하기</span>
                                    </label>
                                </div>
                                ` : `
                                <div style="margin-top: 15px; padding: 10px; background: #f0fdf4; border-radius: 8px; font-size: 0.8rem; border: 1px solid #dcfce7;">
                                    <p style="color: #166534; font-weight: 700; margin: 0;"><i class="fa-solid fa-check-circle"></i> 무제한 옵션이 선택되었습니다.</p>
                                    <p style="margin: 4px 0 0; color: #166534;">3회 초과 시 $30 결제 안내가 제공됩니다.</p>
                                </div>
                                `}
                            </div>
                        </div>
                    `;
                } else {
                    blockHtml = `
                        <div class="system-block" style="border-left: 4px solid #f39c12; background: #fffcf5;">
                            <div class="block-icon" style="background: rgba(243, 156, 18, 0.1); color: #f39c12;"><i class="fa-solid fa-gem"></i></div>
                            <div class="block-content">
                                <p><strong style="color: #e67e22;">무료 변경 횟수 도달</strong></p>
                                <span style="color: #7f8c8d;">기본 제공되는 3회의 변경 기회를 모두 사용하셨습니다.</span>
                                <div style="background: white; padding: 12px; border-radius: 10px; border: 1px solid #f39c1244; margin-bottom: 15px;">
                                    <p style="font-size: 0.85rem; margin: 0; color: #444;"><b>무제한 변경 옵션</b></p>
                                    <p style="font-size: 0.75rem; margin: 5px 0 0; color: #666;">30달러 결제 시, 이후 모든 일정 변경 및 항목 추가 요청이 무제한으로 가능합니다.</p>
                                </div>
                                <div class="block-actions" style="display:flex; flex-direction:column; gap:10px;">
                                    <button class="btn-block-primary" style="background: linear-gradient(135deg, #f39c12, #e67e22); color:white; border:none; padding: 12px;" onclick="window.payForUnlimitedChanges()">무제한 옵션 결제하기 (30 USD)</button>
                                    <button class="btn-block-secondary" style="background:transparent; border: 1px solid #ddd; padding: 8px; border-radius:8px; font-size: 0.8rem;" onclick="window.appendMessage('coord', '추가 변경 없이 현재 예약을 유지합니다.')">현재 예약 유지하기</button>
                                </div>
                            </div>
                        </div>
                    `;
                }
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
        
        container.innerHTML = html;

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    window.selectHospital = function(hIdx, hospitalId) {
        // Instead of expanding list, open the dedicated selection modal
        window.openSelectionModal(hIdx);
        
        // Highlight selection on the list briefly
        document.querySelectorAll('.hospital-list-item').forEach(item => item.classList.remove('selected'));
        const li = document.getElementById(`li-hospital-${hIdx}`);
        if (li) li.classList.add('selected');
    };

    window.openSelectionModal = function(hIdx) {
        const hospitals = JSON.parse(document.body.getAttribute('data-hospitals') || '[]');
        const hospital = hospitals[hIdx];
        if (!hospital) return;

        const modal = document.getElementById('selection-modal');
        const hospitalNameEl = document.getElementById('selection-hospital-name');
        const listContainer = document.getElementById('selection-list-container');

        hospitalNameEl.innerText = hospital.name;
        
        let html = '';
        hospital.categories.forEach((cat, catIdx) => {
            cat.programs.forEach((p, pIdx) => {
                html += `
                    <div class="selection-item">
                        <div class="selection-info">
                            <span class="selection-cat">${cat.name}</span>
                            <span class="selection-title ">${p.title}</span>
                        </div>
                        <button class="btn-confirm-selection" onclick="selectProgram(${hIdx}, ${catIdx}, ${pIdx})">선택하기</button>
                    </div>
                `;
            });
        });

        listContainer.innerHTML = html;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    window.closeSelectionModal = function() {
        const modal = document.getElementById('selection-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    };

    window.selectProgram = function(hIdx, catIdx, pIdx) {
        const hospitals = JSON.parse(document.body.getAttribute('data-hospitals') || '[]');
        const hospital = hospitals[hIdx];
        const program = hospital.categories[catIdx].programs[pIdx];
        
        // Close modals
        window.closeSelectionModal();
        window.closeProgramModal();
        
        // Feedback message
        setTimeout(() => {
            const confirmMsg = `확인되었습니다! **${hospital.name}**의 **${program.title}** 프로그램을 선택하셨습니다. <br><br>예약 및 추가 상담을 이어가시겠습니까?`;
            window.appendMessage('coord', confirmMsg);
            
            // Highlight the hospital card
            document.querySelectorAll('.hospital-list-item').forEach(item => item.classList.remove('selected'));
            const li = document.getElementById(`li-hospital-${hIdx}`);
            if (li) li.classList.add('selected');
        }, 300);
    };

    // Close listeners for selection modal
    document.getElementById('selection-modal-close').addEventListener('click', window.closeSelectionModal);
    document.getElementById('selection-modal').addEventListener('click', (e) => {
        if (e.target.id === 'selection-modal') window.closeSelectionModal();
    });

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
                // Keep consultationData and change info for session continuity
                const consultationData = localStorage.getItem('consultationData');
                const changeCount = localStorage.getItem('changeCount');
                const isUnlimited = localStorage.getItem('isUnlimited');
                
                localStorage.clear();
                
                if (consultationData) localStorage.setItem('consultationData', consultationData);
                if (changeCount) localStorage.setItem('changeCount', changeCount);
                if (isUnlimited) localStorage.setItem('isUnlimited', isUnlimited);
                
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
            • <b>Hospital:</b> ${data.hospitalOpt === 'Yes' ? `<span class="">${data.prefHospital}</span>` : 'Request Recommended List'}<br>
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
        <div class="chat-form-box " style="margin: 15px 0 0 0; padding: 20px; background: rgba(255,255,255,0.8); border-radius: 20px; border: 1.5px solid rgba(46, 204, 113, 0.2);">
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

    // Save to Firestore (Real-time Lead Collection)
    if (db) {
        db.collection('leads').add({
            ...data,
            submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'New'
        }).then(() => console.log('Lead saved to Firestore'))
          .catch(err => console.error('Error saving lead:', err));
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

// Language Selection Logic
document.addEventListener('DOMContentLoaded', () => {
    const currentLang = document.querySelector('.current-lang');
    const langDropdown = document.querySelector('.lang-dropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    const currentLangText = document.getElementById('current-lang');

    if (currentLang && langDropdown) {
        currentLang.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!currentLang.contains(e.target)) {
                langDropdown.classList.remove('show');
            }
        });

        langOptions.forEach(option => {
            option.addEventListener('click', () => {
                const langCode = option.getAttribute('data-lang');
                const langName = option.innerText;
                
                // Update UI
                currentLangText.innerText = langName;
                langDropdown.classList.remove('show');
                
                // Trigger Google Translate
                const gtCombo = document.querySelector('.goog-te-combo');
                if (gtCombo) {
                    gtCombo.value = langCode;
                    gtCombo.dispatchEvent(new Event('change'));
                } else {
                    // Set Google Translate cookie directly and reload
                    document.cookie = "googtrans=/en/" + langCode + "; path=/";
                    document.cookie = "googtrans=/en/" + langCode + "; domain=" + location.hostname + "; path=/";
                    location.reload();
                }
            });
        });
        
        // Auto-detect current language from Google Translate cookie on load
        const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
        if (match && match[1]) {
            const currentCode = match[1];
            const activeOption = document.querySelector(`.lang-option[data-lang="${currentCode}"]`);
            if (activeOption) {
                currentLangText.innerText = activeOption.innerText;
            }
        }
    }
});

// Translation Optimization & Brand Protection
document.addEventListener('DOMContentLoaded', () => {
    // Protect brand names from being translated awkwardly
    const brandElements = document.querySelectorAll('.nav-logo, .brand-name, .logo-text');
    brandElements.forEach(el => el.classList.add('notranslate'));

    // Monitor for Google Translate changes to fix layout issues
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
                document.body.classList.add('translated');
                // Adjust specific elements that might break during translation
                document.querySelectorAll('.bulletin-post p').forEach(p => {
                    p.style.wordBreak = 'break-word';
                });
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['lang']
    });
});


// PayPal Integration Logic
if (document.getElementById('paypal-button-container')) {
    paypal.Buttons({
        style: {
            layout: 'vertical',
            color:  'gold',
            shape:  'rect',
            label:  'paypal'
        },
        createOrder: function(data, actions) {
            const totalStr = document.getElementById('total-price-amount').innerText.replace('$', '');
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: totalStr
                    },
                    description: 'Checkit Korea Health Check Concierge Service'
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert('Transaction completed by ' + details.payer.name.given_name + '!');
            });
        }
    }).render('#paypal-button-container');
}

// --- Schedule Change & Unlimited Logic ---
window.processChangeRequest = function() {
    let changeCount = parseInt(localStorage.getItem('changeCount') || '0');
    const isUnlimited = localStorage.getItem('isUnlimited') === 'true';

    if (!isUnlimited && changeCount >= 3) {
        window.showChatBlock('change-request');
        return;
    }

    const request = prompt("변경 원하시는 일정이나 추가 항목을 입력해 주세요:");
    if (request) {
        if (!isUnlimited) {
            changeCount++;
            localStorage.setItem('changeCount', changeCount.toString());
        }
        
        window.appendMessage('user', `변경 요청: ${request}`);
        setTimeout(() => {
            window.appendMessage('coord', "요청하신 변경 사항을 접수했습니다. 담당 부서 확인 후 답변 드리겠습니다.");
            // Refresh the block to show updated count
            setTimeout(() => window.showChatBlock('change-request'), 1000);
        }, 1000);
    }
};

window.payForUnlimitedChanges = function() {
    if (confirm("30달러를 결제하고 무제한 변경 옵션을 활성화하시겠습니까?")) {
        // Simulating payment
        const paymentMsg = `
            <div class="system-block" style="background: #e3f2fd; border: 1px solid #bbdefb; text-align: center; padding: 15px;">
                <i class="fa-solid fa-credit-card" style="color: #1976d2; font-size: 1.5rem; margin-bottom: 10px; display: block;"></i>
                <strong style="color: #0d47a1;">30 USD 결제가 완료되었습니다</strong>
                <p style="font-size: 0.85rem; color: #1976d2; margin-top: 5px;">무제한 변경 권한이 활성화되었습니다.</p>
            </div>
        `;
        window.appendMessage('system', paymentMsg, 'system');
        
        localStorage.setItem('isUnlimited', 'true');
        
        setTimeout(() => {
            window.appendMessage('coord', "결제가 완료되었습니다! 이제부터 횟수 제한 없이 자유롭게 일정 변경 및 항목 추가 요청이 가능합니다.");
            window.showChatBlock('change-request');
        }, 1500);
    }
};
