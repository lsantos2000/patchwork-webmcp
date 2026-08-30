# Offline command-double tests: no real Git or GitHub commands are executed.
$ErrorActionPreference = 'Stop'
$publisher = Join-Path $PSScriptRoot '../../scripts/publish-github.ps1'
$originalLocation = Get-Location
$global:patchworkPublishTestCommands = [System.Collections.Generic.List[string]]::new()
function git {
  $commandLine = $args -join ' '
  $global:patchworkPublishTestCommands.Add($commandLine)
  $global:LASTEXITCODE = 0
  switch -Wildcard ($commandLine) {
    'branch --show-current' { 'codex/test-branch' }
    'remote' { 'origin' }
    'remote get-url*' {
      if ($global:patchworkPublishTestScenario -eq 'wrong-remote') { 'https://github.com/other/wrong.git' }
      else { 'https://github.com/lsantos2000/patchwork-webmcp.git' }
    }
    'diff --cached --name-only' { 'README.md' }
    'diff --cached --no-ext-diff*' { '+Documentation update' }
    'diff --cached --quiet' { if ($global:patchworkPublishTestScenario -ne 'clean') { $global:LASTEXITCODE = 1 } }
    'commit*' { if ($global:patchworkPublishTestScenario -eq 'commit-failure') { $global:LASTEXITCODE = 1 } }
    'push*' { if ($global:patchworkPublishTestScenario -eq 'push-failure') { $global:LASTEXITCODE = 1 } }
  }
}
function gh {
  $global:LASTEXITCODE = 0
  if (($args -join ' ') -like 'repo view*' -and $global:patchworkPublishTestScenario -eq 'unverified-repo') { $global:LASTEXITCODE = 1 }
}
try {
  foreach ($case in @('clean', 'dirty', 'wrong-remote', 'unverified-repo', 'commit-failure', 'push-failure')) {
    $global:patchworkPublishTestScenario = $case
    $global:patchworkPublishTestCommands.Clear()
    $failed = $false
    $failureMessage = ''
    try { & $publisher -CommitMessage 'Test commit' | Out-Null } catch { $failed = $true; $failureMessage = $_.Exception.Message }
    $shouldFail = $case -notin @('clean', 'dirty')
    if ($failed -ne $shouldFail) { throw "Unexpected result for ${case}: $failureMessage" }
    $commits = @($global:patchworkPublishTestCommands | Where-Object { $_ -like 'commit*' })
    $pushes = @($global:patchworkPublishTestCommands | Where-Object { $_ -like 'push*' })
    if ($case -eq 'clean' -and $commits.Count) { throw 'Clean tree created a commit' }
    if ($case -eq 'dirty' -and $commits.Count -ne 1) { throw 'Dirty tree did not create exactly one commit' }
    if ($case -in @('wrong-remote', 'unverified-repo', 'commit-failure') -and $pushes.Count) { throw 'Unsafe push attempted' }
    if ($case -in @('clean', 'dirty') -and $pushes[0] -ne 'push -u origin HEAD:refs/heads/codex/test-branch') { throw 'Pushed the wrong branch' }
    Write-Output "PASS: $case"
  }
} finally {
  Set-Location $originalLocation
  Remove-Variable patchworkPublishTestCommands,patchworkPublishTestScenario -Scope Global -ErrorAction SilentlyContinue
}
