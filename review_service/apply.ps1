# Apply PostgreSQL related resources
kubectl apply -f review-db-pvc.yaml
kubectl apply -f review-db-deployment.yaml
kubectl apply -f review-db-service.yaml

Write-Host "Waiting for review-db to be ready..."
$postgresReady = $false
for ($i = 0; $i -lt 30; $i++) { # Try for up to 5 minutes (30 * 10 seconds)
    $status = kubectl get deployment review-db -n default -o json | ConvertFrom-Json
    if ($status.status.readyReplicas -eq $status.spec.replicas) {
        $postgresReady = $true
        Write-Host "review-db is ready."
        break
    }
    Write-Host "Waiting... ($($i * 10) seconds)"
    Start-Sleep -Seconds 10
}

if (-not $postgresReady) {
    Write-Error "review-db did not become ready within the timeout."
    exit 1
}

# Apply review-service related resources
kubectl apply -f review-deployment.yaml
kubectl apply -f review-service.yaml

Write-Host "All resources applied successfully!"