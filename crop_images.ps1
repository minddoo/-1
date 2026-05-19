Add-Type -AssemblyName System.Drawing

$files = @("step7.png", "step8.png", "step9.png", "step10.png", "step11.png", "step12.png", "step13.png")
$dir = "C:\Users\pc\.gemini\antigravity\scratch\-1-new\assets\workflow\clean"

foreach ($file in $files) {
    $path = Join-Path $dir $file
    if (Test-Path $path) {
        $img = [System.Drawing.Image]::FromFile($path)
        
        # We want to crop the bottom part which contains the chat input bar and the Gemini logo.
        # Let's say we cut off the bottom 12%.
        $cropHeight = [math]::Round($img.Height * 0.88)
        $rect = New-Object System.Drawing.Rectangle(0, 0, $img.Width, $cropHeight)
        
        $bmp = New-Object System.Drawing.Bitmap($rect.Width, $rect.Height)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.DrawImage($img, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
        $g.Dispose()
        $img.Dispose()
        
        $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        Write-Host "Cropped $file"
    }
}
