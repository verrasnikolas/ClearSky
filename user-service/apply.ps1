# Apply PostgreSQL resources for User Service
kubectl apply -f user-db-pvc.yaml -n default
Write-Host "Applied user-db-pvc.yaml"

kubectl apply -f user-db-deployment.yaml -n default
Write-Host "Applied user-db-deployment.yaml"

kubectl apply -f user-db-service.yaml -n default
Write-Host "Applied user-db-service.yaml"

# Wait for the user-db deployment to be ready
Write-Host "Waiting for user-db deployment to be ready..."
$userDbReady = $false
for ($i = 0; $i -lt 30; $i++) { # Try for up to 5 minutes (30 * 10 seconds)
    $status = kubectl get deployment user-db-deployment -n default -o json | ConvertFrom-Json
    if ($status.status.readyReplicas -eq $status.spec.replicas) {
        $userDbReady = $true
        Write-Host "user-db deployment is ready."
        break
    }
    Write-Host "Waiting... ($($i * 10) seconds)"
    Start-Sleep -Seconds 10
}

if (-not $userDbReady) {
    Write-Error "user-db deployment did not become ready within the timeout."
    exit 1
}

# Apply the User Service deployment
kubectl apply -f user-deployment.yaml -n default
Write-Host "Applied user-service-deployment.yaml"

# Apply the User Service
kubectl apply -f user-service.yaml -n default
Write-Host "Applied user-service.yaml"

# Apply the User Service migration Job
kubectl apply -f user-migration-job.yaml -n default
Write-Host "Applied user-migration-job.yaml"

# Wait for the user-migration Job to complete successfully
Write-Host "Waiting for user database migrations to complete..."
$userMigrationJobComplete = $false
for ($i = 0; $i -lt 60; $i++) { # Try for up to 10 minutes
    $status = kubectl get job user-migration-job -n default -o json | ConvertFrom-Json
    if ($status.status.succeeded -eq 1) {
        $userMigrationJobComplete = $true
        Write-Host "User database migrations completed successfully!"
        break
    }
    if ($status.status.failed -gt 0) {
        Write-Error "User database migration Job failed. Check the Job logs for details."
        kubectl logs -l job-name=user-migration-job -n default
        exit 1
    }
    Write-Host "Waiting for migrations... ($($i * 10) seconds)"
    Start-Sleep -Seconds 10
}

if (-not $userMigrationJobComplete) {
    Write-Error "User database migration Job did not complete within the timeout."
    exit 1
}

Write-Host "All User Service resources applied and migrations completed successfully!"