const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

// Replace #google-login-btn block
css = css.replace(/#google-login-btn\s*\{\s*width:\s*100%;\s*\}/, `#google-login-btn {
    width: 100%;
    display: flex;
    justify-content: center;
}`);

fs.writeFileSync('style.css', css);
console.log('Successfully updated style.css to center Google login button.');
