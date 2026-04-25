$content = Get-Content index.html -Raw -Encoding UTF8
$content = $content -replace 'translate="no"', ''
$content = $content -replace 'notranslate', ''
Set-Content index.html $content -Encoding UTF8

$content = Get-Content main.js -Raw -Encoding UTF8
$content = $content -replace 'translate="no"', ''
$content = $content -replace 'notranslate', ''
Set-Content main.js $content -Encoding UTF8
