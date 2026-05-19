Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("C:\Users\pc\.gemini\antigravity\brain\68159296-48d6-4cf7-8205-7f1dfc7d7f6c\original_step12.png")
$bmp = New-Object System.Drawing.Bitmap($img)

Write-Host "Sampling Y coordinates at X=850 (Inside button region):"
for ($y = 750; $y -lt 850; $y += 10) {
    $c = $bmp.GetPixel(850, $y)
    $r = $c.R
    $g = $c.G
    $b = $c.B
    Write-Host "Y=$y - R:$r G:$g B:$b"
}

Write-Host "`nSampling X coordinates at Y=810 (Across button):"
for ($x = 700; $x -lt 1024; $x += 20) {
    $c = $bmp.GetPixel($x, 810)
    $r = $c.R
    $g = $c.G
    $b = $c.B
    Write-Host "X=$x - R:$r G:$g B:$b"
}

$img.Dispose()
$bmp.Dispose()
