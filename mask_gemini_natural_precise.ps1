Add-Type -AssemblyName System.Drawing

$files = @("step7.png", "step8.png", "step9.png", "step10.png", "step11.png", "step12.png", "step13.png")
$dir = "C:\Users\pc\.gemini\antigravity\scratch\-1-new\assets\workflow\clean"

foreach ($file in $files) {
    # First restore the original uncropped/unmasked image from git
    git checkout 764ff18 -- (Join-Path "assets\workflow\clean" $file)
    
    $path = Join-Path $dir $file
    if (Test-Path $path) {
        $img = [System.Drawing.Image]::FromFile($path)
        $bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.DrawImage($img, 0, 0, $img.Width, $img.Height)
        
        # 1. We locate the sparkle very precisely.
        # The sparkle is a small 4-pointed star (✨) located in the bottom-right corner of the text area.
        # Let's use a very small mask size of 32x32 pixels to ensure we NEVER touch the input bar borders.
        # Coordinates relative to image size:
        $rectWidth = 32
        $rectHeight = 32
        
        # We adjust coordinates based on the width of the image.
        # step7 is 944x901, others are 1024x1024.
        if ($img.Width -eq 944) {
            # step7
            $rectX = $img.Width - 62
            $rectY = $img.Height - 65
        } else {
            # 1024x1024 images
            $rectX = $img.Width - 65
            $rectY = $img.Height - 70
        }
        
        # 2. Dynamic Color Sampling:
        # We sample the background color just 8 pixels to the left of our tiny mask box
        # to get a 100% accurate background color of the text input area.
        $sampleX = $rectX - 8
        $sampleY = $rectY + ($rectHeight / 2)
        
        $sampleColor = $bmp.GetPixel($sampleX, $sampleY)
        $brush = New-Object System.Drawing.SolidBrush($sampleColor)
        
        # 3. Apply the tiny mask box
        $g.FillRectangle($brush, $rectX, $rectY, $rectWidth, $rectHeight)
        
        $brush.Dispose()
        $g.Dispose()
        $img.Dispose()
        
        # Save the naturally blended image back
        $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        Write-Host "Precisely masked Gemini logo in $file at ($rectX, $rectY) with color (R:$($sampleColor.R), G:$($sampleColor.G), B:$($sampleColor.B))"
    }
}
