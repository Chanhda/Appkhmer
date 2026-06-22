Add-Type -AssemblyName System.Drawing

$files = @(
  "assets/articles/bun-nuoc-leo.png",
  "assets/articles/nhac-ngu-am-pinpeat.png",
  "assets/heritages/chua-chantarangsay.png",
  "assets/heritages/chua-doi.png",
  "assets/heritages/chua-ghositaram.png",
  "assets/heritages/chua-hang.png",
  "assets/heritages/chua-som-rong.png",
  "assets/heritages/le-hoi-kathina.png",
  "assets/heritages/le-hoi-ooc-om-bok.png",
  "assets/heritages/le-hoi-sene-dolta.png",
  "assets/heritages/nghe-thuat-chapei-don-ca.png",
  "assets/heritages/nghe-thuat-ro-bam.png"
)

foreach ($file in $files) {
    $fullPath = Resolve-Path $file
    Write-Host "Converting $file to actual PNG format..."
    
    # Load JPEG image
    $img = [System.Drawing.Image]::FromFile($fullPath)
    
    # Save to temp file as PNG
    $tempPath = "$fullPath.tmp"
    $img.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $img.Dispose()
    
    # Replace original file with the PNG version
    Remove-Item $fullPath
    Rename-Item $tempPath -NewName (Split-Path $fullPath -Leaf)
}

Write-Host "Conversion completed successfully!"
