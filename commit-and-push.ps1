[CmdletBinding()]
param(
  [Parameter(Position = 0)]
  [ValidateNotNullOrEmpty()]
  [string]$Message = 'Update Patchwork WebMCP',

  [string]$Branch = 'main',

  [switch]$SkipConfirmation
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

if (-not (Test-Path '.git')) {
  throw 'This script must run from the Patchwork Git repository.'
}

foreach ($command in @('git', 'gh')) {
  if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
    throw "Required command '$command' was not found."
  }
}

gh auth status --hostname github.com *> $null
if ($LASTEXITCODE -ne 0) {
  Write-Host 'GitHub authorization is required. Opening the secure browser flow...'
  gh auth login --hostname github.com --git-protocol https --web
  if ($LASTEXITCODE -ne 0) {
    throw 'GitHub authorization was not completed.'
  }
}

$blockedPathPattern = '(^|/)(\.env($|\.)|\.wrangler/|\.openai/|credentials\.json$)|\.(pem|key|p12|pfx)$'
$credentialPattern = '(?i)(gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,}|api[_-]?key\s*[:=]\s*["''][^"'']{12,}|secret\s*[:=]\s*["''][^"'']{12,}|bearer\s+[A-Za-z0-9._-]{20,})'

$candidateFiles = @(git status --porcelain=v1 | ForEach-Object {
  if ($_.Length -gt 3) { $_.Substring(3).Trim('"') }
})

if ($candidateFiles.Count -eq 0) {
  Write-Host 'Nothing to commit. The working tree is clean.'
  exit 0
}

$blockedFiles = @($candidateFiles | Where-Object { $_ -match $blockedPathPattern })
if ($blockedFiles.Count -gt 0) {
  throw "Refusing to stage potentially sensitive files: $($blockedFiles -join ', ')"
}

Write-Host 'Files proposed for commit:'
$candidateFiles | ForEach-Object { Write-Host "  $_" }

if (-not $SkipConfirmation) {
  $approval = Read-Host 'Type YES to stage, commit, and push these files'
  if ($approval -cne 'YES') {
    Write-Host 'Cancelled. No files were staged or pushed.'
    exit 0
  }
}

git add --all
if ($LASTEXITCODE -ne 0) { throw 'Unable to stage the changes.' }

$stagedFiles = @(git diff --cached --name-only)
$blockedStagedFiles = @($stagedFiles | Where-Object { $_ -match $blockedPathPattern })
if ($blockedStagedFiles.Count -gt 0) {
  git restore --staged -- $blockedStagedFiles
  throw "Sensitive paths were removed from staging: $($blockedStagedFiles -join ', ')"
}

$stagedDiff = git diff --cached --no-ext-diff --unified=0
if ($stagedDiff -match $credentialPattern) {
  git reset --quiet
  throw 'A possible credential was detected. Nothing was committed.'
}

git diff --cached --check
if ($LASTEXITCODE -ne 0) {
  throw 'Git found whitespace errors. Fix them before publishing.'
}

git commit -m $Message
if ($LASTEXITCODE -ne 0) { throw 'The commit could not be created.' }

$githubToken = gh auth token
$encodedCredential = [Convert]::ToBase64String(
  [Text.Encoding]::ASCII.GetBytes("x-access-token:$githubToken")
)

try {
  git -c "http.https://github.com/.extraheader=AUTHORIZATION: basic $encodedCredential" push origin "HEAD:$Branch"
  if ($LASTEXITCODE -ne 0) { throw 'The push to GitHub failed.' }
}
finally {
  Remove-Variable githubToken, encodedCredential -ErrorAction SilentlyContinue
}

Write-Host "Published successfully to branch '$Branch'."
