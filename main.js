// Sticky Header Effect
const header = document.getElementById('mainHeader');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth Scroll for Nav Links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Remove active from all
                document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
                // Add active to current
                this.classList.add('active');
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Simple Reveal Animation on Scroll
const revealElements = document.querySelectorAll('.feature-card, .section-head, .cta-box');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    revealObserver.observe(el);
});

// Landing Log
console.log('%c CHECKIT GLOBAL %c Premium B2C Health Platform Loaded ', 
            'background: #1e3a8a; color: #fff; padding: 5px; font-weight: bold; border-radius: 5px 0 0 5px;',
            'background: #10b981; color: #fff; padding: 5px; font-weight: bold; border-radius: 0 5px 5px 0;');
