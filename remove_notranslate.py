import os

files = ['index.html', 'main.js']

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('translate="no"', '')
    content = content.replace('notranslate', '')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Removed translation blocks from {file}")
