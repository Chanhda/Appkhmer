$file = Get-ChildItem -Path "c:\Users\HP\khmerApp" -Filter "*.docx" | Select-Object -First 1
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($file.FullName)
$entry = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
$xmlStr = $reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()

$xml = [xml]$xmlStr
$paragraphs = $xml.getElementsByTagName("w:p")
$lines = @()
foreach ($p in $paragraphs) {
    $t = $p.InnerText.Trim()
    if ($t.Length -gt 0 -and $t.Length -lt 100) {
        $lines += $t
    }
}
$lines | Select-Object -First 150 | Out-File -FilePath "c:\Users\HP\khmerApp\scratch_all.txt" -Encoding utf8
"Done"
