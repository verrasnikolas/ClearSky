# Apply PostgreSQL resources
kubectl apply -f stats-db-pvc.yaml
Write-Host "Applied stats-db-pvc.yaml"

kubectl apply -f stats-db-deployment.yaml
Write-Host "Applied stats-db-deployment.yaml"

kubectl apply -f stats-db-service.yaml
Write-Host "Applied stats-db-service.yaml"

# Wait for the stats-db deployment to be ready
Write-Host "Waiting for stats-db to be ready..."
$postgresReady = $false
for ($i = 0; $i -lt 30; $i++) {
    $status = kubectl get deployment stats-db -n default -o json | ConvertFrom-Json
    if ($status.status.readyReplicas -eq $status.spec.replicas) {
        $postgresReady = $true
        Write-Host "stats-db is ready."
        break
    }
    Write-Host "Waiting... ($($i * 10) seconds)"
    Start-Sleep -Seconds 10
}

if (-not $postgresReady) {
    Write-Error "stats-db did not become ready within the timeout."
    exit 1
}

# Apply the Job to create the uuid-ossp extension
kubectl apply -f stats-create-uuid-extension-job.yaml
Write-Host "Applied stats-create-uuid-extension-job.yaml"

# Wait for the uuid-ossp Job to complete
Write-Host "Waiting for stats-create-uuid-extension Job to complete..."
$extensionJobComplete = $false
for ($i = 0; $i -lt 30; $i++) {
    $status = kubectl get job stats-create-uuid-extension -n default -o json | ConvertFrom-Json
    if ($status.status.succeeded -eq 1) {
        $extensionJobComplete = $true
        Write-Host "uuid-ossp extension created successfully."
        break
    }
    if ($status.status.failed -gt 0) {
        Write-Error "stats-create-uuid-extension Job failed. Check the Job logs for details:"
        kubectl logs -l job-name=stats-create-uuid-extension -n default
        exit 1
    }
    Write-Host "Waiting... ($($i * 10) seconds)"
    Start-Sleep -Seconds 10
}

if (-not $extensionJobComplete) {
    Write-Error "stats-create-uuid-extension Job did not complete within the timeout."
    exit 1
}

# Apply the stats-service resources
kubectl apply -f stats-deployment.yaml
Write-Host "Applied stats-deployment.yaml"

kubectl apply -f stats-service.yaml
Write-Host "Applied stats-service.yaml"

# Ensure no previous migration job is running
Write-Host "Cleaning up any existing stats-db-migrate Job..."
kubectl delete job stats-db-migrate --ignore-not-found -n default

# Apply the stats migration Job
kubectl apply -f stats-migrate-job.yaml -n default
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to apply stats-migrate-job.yaml"
    exit 1
}
Write-Host "Applied stats-migrate-job.yaml"

# Wait for the migration pod to be created and initialized
Write-Host "Waiting for stats-db-migrate pod to initialize..."
for ($j = 0; $j -lt 30; $j++) {
    $podStatus = kubectl get pod -l job-name=stats-db-migrate -n default -o json | ConvertFrom-Json
    if ($podStatus.items.Count -gt 0 -and $podStatus.items[0].status.phase -ne "Pending") {
        Write-Host "stats-db-migrate pod is initializing..."
        break
    }
    Write-Host "Waiting for pod creation... ($($j * 5) seconds)"
    Start-Sleep -Seconds 5
}

# Wait for the migration Job to complete
Write-Host "Waiting for stats-db-migrate Job to complete..."
$migrationJobComplete = $false
for ($i = 0; $i -lt 60; $i++) {
    $status = kubectl get job stats-db-migrate -n default -o json | ConvertFrom-Json
    if ($status.status.succeeded -eq 1) {
        $migrationJobComplete = $true
        Write-Host "Stats database migrations completed successfully!"
        break
    }
    if ($status.status.failed -gt 0) {
        Write-Error "Stats database migration Job failed. Logs:"
        kubectl logs -l job-name=stats-db-migrate -n default
        exit 1
    }
    Write-Host "Waiting for migrations... ($($i * 10) seconds)"
    Start-Sleep -Seconds 10
}

if (-not $migrationJobComplete) {
    Write-Error "Stats database migration Job did not complete within the timeout."
    # Try to show logs anyway
    kubectl logs -l job-name=stats-db-migrate -n default
    exit 1
}

Write-Host "`n✅ All resources applied and migrations completed successfully!"
