# Regenerate cPanel deployment zips with forward-slash entry paths (Linux-safe).
# Run from project root after `npm run build`.
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = (Get-Location).Path
$out  = Join-Path $root "dist-deploy"

# --- Rebuild staging from fresh .output ---
$appDir = Join-Path $out "wavypro"
$docDir = Join-Path $out "docroot"
if (Test-Path $appDir) { Remove-Item -Recurse -Force $appDir }
if (Test-Path $docDir) { Remove-Item -Recurse -Force $docDir }
New-Item -ItemType Directory -Force $appDir | Out-Null
New-Item -ItemType Directory -Force $docDir | Out-Null

$output = Join-Path $root ".output"

# Application root (wavypro): app.mjs, package.json, nitro.json, public/, server/
Copy-Item (Join-Path $output "app.mjs")       (Join-Path $appDir "app.mjs")
Copy-Item (Join-Path $output "package.json")  (Join-Path $appDir "package.json")
Copy-Item (Join-Path $output "nitro.json")    (Join-Path $appDir "nitro.json")
Copy-Item (Join-Path $output "public")        (Join-Path $appDir "public") -Recurse
Copy-Item (Join-Path $output "server")        (Join-Path $appDir "server") -Recurse

# Document root (wavyprogroup.com): .htaccess + everything under public/ at the root
Copy-Item (Join-Path $root "deploy\.htaccess") (Join-Path $docDir ".htaccess")
Get-ChildItem (Join-Path $output "public") -Force | ForEach-Object {
  Copy-Item $_.FullName (Join-Path $docDir $_.Name) -Recurse
}

function New-ZipForwardSlash($sourceDir, $zipPath) {
  if (Test-Path $zipPath) { Remove-Item -Force $zipPath }
  $fs = [System.IO.File]::Create($zipPath)
  $zip = New-Object System.IO.Compression.ZipArchive($fs, [System.IO.Compression.ZipArchiveMode]::Create)
  $base = (Resolve-Path $sourceDir).Path.TrimEnd('\') + '\'
  Get-ChildItem $sourceDir -Recurse -Force -File | ForEach-Object {
    $rel = $_.FullName.Substring($base.Length).Replace('\','/')
    $entry = $zip.CreateEntry($rel, [System.IO.Compression.CompressionLevel]::Optimal)
    $es = $entry.Open()
    $fileStream = [System.IO.File]::OpenRead($_.FullName)
    $fileStream.CopyTo($es)
    $fileStream.Close()
    $es.Close()
  }
  $zip.Dispose()
  $fs.Close()
}

New-ZipForwardSlash $appDir (Join-Path $out "wavypro.zip")
New-ZipForwardSlash $docDir (Join-Path $out "wavyprogroup.com.zip")

Write-Output "Zips regenerated:"
Get-ChildItem (Join-Path $out "*.zip") | ForEach-Object { Write-Output ("  " + $_.Name + "  " + [math]::Round($_.Length/1MB,2) + " MB") }
