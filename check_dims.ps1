Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("assets/workflow/clean/step1.png")
Write-Host "step1: $($img.Width)x$($img.Height)"
$img.Dispose()

$img7 = [System.Drawing.Image]::FromFile("assets/workflow/clean/step7.png")
Write-Host "step7: $($img7.Width)x$($img7.Height)"
$img7.Dispose()
