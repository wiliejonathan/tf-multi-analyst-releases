$ErrorActionPreference = 'Stop'
# Run once for the current Windows user. No administrator privileges or server needed.
$sourceExe = Join-Path ([IO.Path]::GetFullPath($PSScriptRoot)) 'TFIndicatorCompiler.exe'
$compilerFolder = Join-Path $env:LOCALAPPDATA 'TFAnalyzerAnalyst\IndicatorCompiler'
New-Item -ItemType Directory -Path $compilerFolder -Force | Out-Null
Copy-Item -LiteralPath $sourceExe -Destination (Join-Path $compilerFolder 'TFIndicatorCompiler.exe') -Force
$compilerExe = Join-Path $compilerFolder 'TFIndicatorCompiler.exe'
if (!(Test-Path -LiteralPath $compilerExe -PathType Leaf)) { throw 'TFIndicatorCompiler.exe tidak ditemukan.' }
$manifestPath = Join-Path $compilerFolder 'com.tfanalyst.indicator_compiler.json'
$hostManifest = @{
    name = 'com.tfanalyst.indicator_compiler'
    description = 'TF Analyst local MetaEditor compiler'
    path = $compilerExe
    type = 'stdio'
    allowed_origins = @('chrome-extension://ecmcgemakncajgbglkggibjgmochancm/')
}
[IO.File]::WriteAllText($manifestPath, ($hostManifest | ConvertTo-Json -Depth 4), [Text.UTF8Encoding]::new($false))
$registration = 'HKCU:\Software\Google\Chrome\NativeMessagingHosts\com.tfanalyst.indicator_compiler'
New-Item -Path $registration -Force | Out-Null
Set-Item -Path $registration -Value $manifestPath
Write-Host 'Compiler lokal terpasang. Reload plugin Chrome lalu buka Created MT4/MT5 Indicator.'
