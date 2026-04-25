const fs = require('fs');
const files = ['index.html', 'main.js'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/translate="no"/g, '');
    content = content.replace(/notranslate/g, '');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Removed translation blocks from ${file}`);
});
