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

$previousErrorAction = $ErrorActionPreference
$ErrorActionPreference = "Continue"
$analysis = & $ffmpeg -hide_banner -i $input -vn -af "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json" -f null NUL 2>&1 | Out-String
$analysisExitCode = $LASTEXITCODE
$ErrorActionPreference = $previousErrorAction
if ($analysisExitCode -ne 0) {
  throw "Audio analysis failed with exit code $analysisExitCode."
}
$match = [regex]::Match($analysis, '\{[\s\S]*?"target_offset"\s*:\s*"[^"]+"\s*\}')
if (-not $match.Success) {
  throw "Could not parse loudness analysis."
}
$stats = $match.Value | ConvertFrom-Json
$filter = "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$($stats.input_i):measured_LRA=$($stats.input_lra):measured_TP=$($stats.input_tp):measured_thresh=$($stats.input_thresh):offset=$($stats.target_offset):linear=true:print_format=summary"

& $ffmpeg -y -i $input -c:v copy -af $filter -ar 48000 -c:a aac -b:a 256k $temp
if ($LASTEXITCODE -ne 0) {
  throw "Audio mastering failed with exit code $LASTEXITCODE."
}

Move-Item -LiteralPath $temp -Destination $input -Force
Write-Output "Two-pass loudness mastering complete: -16 LUFS / -1.5 dBTP"
