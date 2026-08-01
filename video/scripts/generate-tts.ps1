$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Speech

$output = Join-Path $PSScriptRoot "..\public\audio\tts"
New-Item -ItemType Directory -Force $output | Out-Null

$lines = @(
  @{ File = "01-intro.wav"; Text = "그 경기를 되감고, 내가 감독이 됩니다. 되감독 구십." },
  @{ File = "02-archive.wav"; Text = "아쉬웠던 월드컵의 결정적 순간을 골라, 다시 지휘합니다." },
  @{ File = "03-tactics.wav"; Text = "선수 위치, 포메이션, 교체와 전술 강도를 직접 바꿉니다." },
  @{ File = "04-cause.wav"; Text = "내 판단이 만든 공간과 득점 기대, 역습 위험을 즉시 설명합니다." },
  @{ File = "05-replay.wav"; Text = "내 전술로 경기를 재생하고, 공이 골라인을 통과해야만 득점이 완성됩니다." },
  @{ File = "06-report.wav"; Text = "실제 경기와 기준 전술, 내 선택, 코치 제안을 한 화면에서 비교합니다." },
  @{ File = "07-outro.wav"; Text = "결과를 바꾸는 건 클릭이 아니라 판단입니다. 지금, 감독석에 앉으세요." }
)

Get-ChildItem -Path $output -File | Remove-Item -Force
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice("Microsoft Heami Desktop")
$synth.Rate = 5
$synth.Volume = 100

try {
  foreach ($line in $lines) {
    $synth.SetOutputToWaveFile((Join-Path $output $line.File))
    $synth.Speak($line.Text)
    $synth.SetOutputToNull()
  }
} finally {
  $synth.Dispose()
}