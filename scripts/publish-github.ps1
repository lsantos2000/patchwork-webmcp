[CmdletBinding()]
param(
  [string]$RepoName = 'patchwork-webmcp',
  [string]$Owner = 'lsantos2000',
  [string]$CommitMessage = 'Launch Patchwork WebMCP challenge app'
)
$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location $projectRoot
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { throw 'GitHub CLI (gh) is required. Install it from https://cli.github.com/.' }
gh auth status 2>$null
if ($LASTEXITCODE -ne 0) {
  gh auth login --hostname github.com --git-protocol https --web
  if ($LASTEXITCODE -ne 0) { throw 'GitHub authorization was not completed.' }
}
if (-not (Test-Path '.git')) { git init -b main }
git add --all
$stagedFiles = git diff --cached --name-only
$blockedPaths = $stagedFiles | Where-Object { $_ -match '(^|/)(\.env($|\.)|\.wrangler/|\.openai/|credentials\.json$)' -or $_ -match '\.(pem|key|p12|pfx)$' }
if ($blockedPaths) { throw "Refusing to publish sensitive paths: $($blockedPaths -join ', ')" }
$diff = git diff --cached --no-ext-diff --unified=0
$credentialPattern = '(?i)(gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,}|api[_-]?key\s*[:=]\s*["''][^"'']{12,}|secret\s*[:=]\s*["''][^"'']{12,}|bearer\s+[A-Za-z0-9._-]{20,})'
if ($diff -match $credentialPattern) { throw 'Possible credential detected in staged content. Review the staged diff before publishing.' }
if (-not (git diff --cached --quiet)) { git commit -m $CommitMessage }
$fullName = "$Owner/$RepoName"
gh repo view $fullName *> $null
if ($LASTEXITCODE -eq 0) {
  if (-not (git remote get-url origin 2>$null)) { git remote add origin "https://github.com/$fullName.git" }
  git push -u origin main
} else {
  gh repo create $fullName --public --source . --remote origin --push --description 'A human-in-the-loop neighbourhood action exchange powered by WebMCP.'
}
Write-Host "Published safely to https://github.com/$fullName"
