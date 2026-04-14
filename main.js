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

function changeLanguage(langCode) {
    const googleSelect = document.querySelector('select.goog-te-combo');
    if (googleSelect) {
        // If langCode is 'en' (source language), we want to show original
        const targetValue = (langCode === 'en') ? '' : langCode;
        
        googleSelect.value = targetValue;
        googleSelect.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Hide the Google Translate toolbar if it appears
        setTimeout(() => {
            const frame = document.querySelector('.goog-te-banner-frame');
            if (frame) frame.style.display = 'none';
            document.body.style.top = '0';
        }, 800);
    } else {
        // Retry if Google Translate isn't loaded yet
        setTimeout(() => changeLanguage(langCode), 500);
    }
}

// Check for saved language preference on load
window.addEventListener('load', () => {
    const savedLang = localStorage.getItem('preferred-lang');
    const savedLangName = localStorage.getItem('preferred-lang-name');
    
    if (savedLang && savedLang !== 'en') {
        if (currentLangText) currentLangText.innerText = savedLangName;
        // Wait for Google script to fully initialize
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

if (authModal && loginBtn) {
    // Open Modal
    loginBtn.addEventListener('click', (e) => {
        if (localStorage.getItem('isLoggedIn')) return; // If logged in, maybe go to profile (but we'll keep it simple for now)
        e.preventDefault();
        authModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scroll
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
            const submitBtn = form.querySelector('.auth-submit');
            const originalText = submitBtn.innerText;
            
            // Loading state
            submitBtn.innerText = 'Processing...';
            submitBtn.disabled = true;

            setTimeout(() => {
                const nameInput = form.querySelector('input[type="text"]');
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
