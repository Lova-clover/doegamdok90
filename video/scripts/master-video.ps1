$ErrorActionPreference = "Stop"

$videoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$repoRoot = (Resolve-Path (Join-Path $videoRoot "..")).Path
$outputRoot = (Resolve-Path (Join-Path $repoRoot "output\video")).Path
$ffmpeg = Join-Path $videoRoot "node_modules\@remotion\compositor-win32-x64-msvc\ffmpeg.exe"
$input = Join-Path $outputRoot "doegamdok90-demo.mp4"
$temp = Join-Path $outputRoot "doegamdok90-demo-mastering.mp4"

if (-not (Test-Path -LiteralPath $ffmpeg)) {
  throw "Remotion ffmpeg was not found. Run npm ci first."
}
if (-not (Test-Path -LiteralPath $input)) {
  throw "Rendered video was not found: $input"
}
if (-not $input.StartsWith($outputRoot + [IO.Path]::DirectorySeparatorChar)) {
  throw "Unsafe input path."
}
if (-not $temp.StartsWith($outputRoot + [IO.Path]::DirectorySeparatorChar)) {
  throw "Unsafe output path."
}

& $ffmpeg -y -i $input -c:v copy -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 256k $temp
if ($LASTEXITCODE -ne 0) {
  throw "Audio mastering failed with exit code $LASTEXITCODE."
}

Move-Item -LiteralPath $temp -Destination $input -Force

