param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[a-f0-9]{40}$')]
    [string]$Commit,
    [string]$Namespace = 'doki-barber'
)
$ErrorActionPreference = 'Stop'
# Use only the explicitly intended local context.
$context = 'docker-desktop'
kubectl --context $context get namespace $Namespace -o name 2>$null
if ($LASTEXITCODE -ne 0) {
    kubectl --context $context create namespace $Namespace
    if ($LASTEXITCODE -ne 0) { throw 'Cannot create namespace' }
}
kubectl --context $context -n $Namespace get secret barber-db -o name
if ($LASTEXITCODE -ne 0) { throw 'Create barber-db secret as documented before deployment' }
$manifest = Get-Content (Join-Path $PSScriptRoot '../k8s.yaml') -Raw
$manifest = $manifest.Replace('doki_barber-backend:dev', "doki_barber-backend:sha-$Commit")
$manifest = $manifest.Replace('doki_barber-frontend:dev', "doki_barber-frontend:sha-$Commit")
$manifest | kubectl --context $context -n $Namespace apply -f -
if ($LASTEXITCODE -ne 0) { throw 'Apply failed' }
foreach ($deployment in @('barber-postgres', 'barber-backend', 'barber-frontend')) {
    kubectl --context $context -n $Namespace rollout status "deployment/$deployment" --timeout=300s
    if ($LASTEXITCODE -ne 0) { throw "Rollout failed: $deployment" }
}
