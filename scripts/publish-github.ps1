[CmdletBinding()]
param(
  [ValidatePattern('^[A-Za-z0-9_.-]+$')][string]$RepoName = 'patchwork-webmcp',
  [ValidatePattern('^[A-Za-z0-9-]+$')][string]$Owner = 'lsantos2000',
  [string]$CommitMessage = 'Update Patchwork WebMCP',
  [switch]$CreateRepository
)
$ErrorActionPreference = 'Stop'
function Invoke-Git {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$GitArgs)
  & git @GitArgs
  if ($LASTEXITCODE -ne 0) { throw "Git command failed: $($GitArgs[0])" }
}
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location $projectRoot
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { throw 'GitHub CLI (gh) is required. Install it from https://cli.github.com/.' }
gh auth status 2>$null
if ($LASTEXITCODE -ne 0) {
  gh auth login --hostname github.com --git-protocol https --web
  if ($LASTEXITCODE -ne 0) { throw 'GitHub authorization was not completed.' }
}
if (-not (Test-Path '.git')) { Invoke-Git init -b main }
$branch = (Invoke-Git branch --show-current).Trim()
if (-not $branch) { throw 'Detached HEAD: select the branch you intend to publish.' }
$fullName = "$Owner/$RepoName"
$remotes = @(Invoke-Git remote)
if ($remotes -contains 'origin') {
  $allowed = @("https://github.com/$fullName.git", "https://github.com/$fullName", "git@github.com:$fullName.git", "ssh://git@github.com/$fullName.git")
  $remoteUrls = @((Invoke-Git remote get-url --all origin), (Invoke-Git remote get-url --push --all origin))
  foreach ($remoteUrl in $remoteUrls) {
    if ($remoteUrl -notin $allowed) { throw 'Origin does not match the requested repository. Nothing was staged or pushed.' }
  }
}
gh repo view $fullName *> $null
$repoExists = $LASTEXITCODE -eq 0
if (-not $repoExists -and -not $CreateRepository) { throw 'Cannot verify target repository. Check access/network, or explicitly use -CreateRepository for a new public repository.' }
Invoke-Git add --all
$stagedFiles = Invoke-Git diff --cached --name-only
$blockedPaths = $stagedFiles | Where-Object { $_ -match '(^|/)(\.env($|\.)|\.wrangler/|\.openai/|credentials\.json$)' -or $_ -match '\.(pem|key|p12|pfx)$' }
if ($blockedPaths) { throw "Refusing to publish sensitive paths: $($blockedPaths -join ', ')" }
$diff = (Invoke-Git diff --cached --no-ext-diff --unified=0) -join "`n"
$credentialPattern = '(?i)(gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,}|api[_-]?key\s*[:=]\s*["''][^"'']{12,}|secret\s*[:=]\s*["''][^"'']{12,}|bearer\s+[A-Za-z0-9._-]{20,})'
if ($diff -match $credentialPattern) { throw 'Possible credential detected in staged content. Review the staged diff before publishing.' }
Invoke-Git diff --cached --check
git diff --cached --quiet
$diffExit = $LASTEXITCODE
if ($diffExit -eq 1) { Invoke-Git commit -m $CommitMessage }
elseif ($diffExit -ne 0) { throw 'Could not check staged changes.' }
if (-not $repoExists) {
  gh repo create $fullName --public --description 'A neighbourhood planning prototype powered by WebMCP.'
  if ($LASTEXITCODE -ne 0) { throw 'Repository creation failed. Nothing was pushed.' }
}
if ($remotes -notcontains 'origin') { Invoke-Git remote add origin "https://github.com/$fullName.git" }
Invoke-Git push -u origin "HEAD:refs/heads/$branch"
Write-Host "Published branch $branch to https://github.com/$fullName"
Write-Host 'Credential-pattern checks are a precaution, not a comprehensive secret audit.'
