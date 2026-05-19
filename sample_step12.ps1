Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("C:\Users\pc\.gemini\antigravity\brain\68159296-48d6-4cf7-8205-7f1dfc7d7f6c\original_step12.png")
$bmp = New-Object System.Drawing.Bitmap($img)

# Sample some pixel colors inside the green button
# The green button is at the bottom right. Let's sample X: 850, Y: 930
$color1 = $bmp.GetPixel(850, 930)
Write-Host "Color at (850, 930): R:$($color1.R), G:$($color1.G), B:$($color1.B)"

# Let's also print the width and height of the image to be absolutely sure
Write-Host "Dimensions: $($img.Width)x$($img.Height)"

$img.Dispose()
$bmp.Dispose()
