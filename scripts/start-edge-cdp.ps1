$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$configPath = Join-Path $projectRoot "config\agent.config.json"
$config = Get-Content -LiteralPath $configPath -Raw | ConvertFrom-Json
$edgePath = $config.edgeExecutablePath
$profilePath = Join-Path $projectRoot $config.edgeUserDataDir

if (-not (Test-Path -LiteralPath $edgePath)) {
  throw "Microsoft Edge was not found at: $edgePath"
}

New-Item -ItemType Directory -Force -Path $profilePath | Out-Null

$args = @(
  "--remote-debugging-port=9222",
  "--user-data-dir=$profilePath",
  "--no-first-run",
  "--no-default-browser-check"
)

Start-Process -FilePath $edgePath -ArgumentList $args -WindowStyle Normal
Write-Host "Started Edge CDP on http://127.0.0.1:9222 using temporary profile: $profilePath"
