const fs = require('fs');
let html = fs.readFileSync('master_dashboard.html', 'utf8');

// Replace CSS Variables and Fonts
html = html.replace(
    /@import url[^>]*Montserrat[^>]*;/g,
    `@import url('https://cdn.jsdelivr.net/npm/pretendard@1.3.8/dist/web/static/pretendard.css');
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');`
);

html = html.replace(/font-family: 'Montserrat', sans-serif;/g, "font-family: 'Pretendard', 'Outfit', sans-serif;");

html = html.replace(/:root {[\s\S]*?}/, `:root {
            --bg-master: #f0f7f4;
            --surface-master: #ffffff;
            --master-accent: #2ECC71;
            --master-accent-dark: #27ae60;
            --master-accent-light: #abebc6;
            --text-dark: #0f172a;
            --text-main: #1e293b;
            --text-muted: #64748b;
            --glass-bg: rgba(255, 255, 255, 0.85);
            --shadow-soft: 0 10px 40px rgba(0, 0, 0, 0.04);
            --shadow-premium: 0 24px 60px rgba(0, 0, 0, 0.08);
            --radius: 24px;
        }`);

// Replace logo text with image
html = html.replace(/<div class="login-logo">.*?<\/div>/s, `<div class="login-logo" style="display:flex; justify-content:center; margin-bottom:15px;"><img src="assets/logo.png" style="height: 48px;" alt="Checkit Logo"></div>`);
html = html.replace(/<div class="master-logo">[\s\S]*?<\/div>/s, `<div class="master-logo"><img src="assets/logo.png" style="height: 36px;" alt="Checkit Logo"><span style="font-size: 1.2rem; margin-left: 10px; color: var(--text-dark); font-weight: 800; font-family: 'Outfit', sans-serif; letter-spacing: 1px;">MASTER</span></div>`);

// Update some CSS rules
html = html.replace(/background: linear-gradient[^;]*;/g, "background: var(--bg-master);");
html = html.replace(/border-radius: 20px;/g, "border-radius: var(--radius);");
html = html.replace(/box-shadow: 0 20px 50px rgba\(0, 0, 0, 0.08\);/g, "box-shadow: var(--shadow-premium);");

// Ensure tab-btn active state matches new colors
html = html.replace(/background: rgba\(75, 107, 142, 0.08\);/g, "background: rgba(46, 204, 113, 0.1); color: var(--master-accent-dark);");
html = html.replace(/color: #4b6b8e;/g, "color: var(--master-accent-dark);");

fs.writeFileSync('master_dashboard.html', html);
console.log('Done');
