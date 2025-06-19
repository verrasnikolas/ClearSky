# Apply PostgreSQL resources
kubectl apply -f grades-db-pvc.yaml
Write-Host "Applied grades-db-pvc.yaml"

kubectl apply -f grades-db-deployment.yaml
Write-Host "Applied grades-db-deployment.yaml"

kubectl apply -f grades-db-service.yaml
Write-Host "Applied grades-db-service.yaml"

Write-Host "Waiting for grades-db to be ready..."
$postgresReady = $false
for ($i = 0; $i -lt 30; $i++) { # Try for up to 5 minutes (30 * 10 seconds)
    $status = kubectl get deployment grades-db -n default -o json | ConvertFrom-Json
    if ($status.status.readyReplicas -eq $status.spec.replicas) {
        $postgresReady = $true
        Write-Host "grades-db is ready."
        break
    }
    Write-Host "Waiting... ($($i * 10) seconds)"
    Start-Sleep -Seconds 10
}

if (-not $postgresReady) {
    Write-Error "grades-db did not become ready within the timeout."
    exit 1
}

# Apply the Job to create the uuid-ossp extension
kubectl apply -f grades-create-uuid-extension-job.yaml
Write-Host "Applied grades-grades-create-uuid-extension-job.yaml"

# Wait for the create-uuid-extension Job to complete successfully
Write-Host "Waiting for grades-create-uuid-extension Job to complete..."
$extensionJobComplete = $false
for ($i = 0; $i -lt 30; $i++) { # Try for up to 5 minutes
    $status = kubectl get job grades-create-uuid-extension -n default -o json | ConvertFrom-Json
    if ($status.status.succeeded -eq 1) {
        $extensionJobComplete = $true
        Write-Host "uuid-ossp extension created successfully."
        break
    }
    if ($status.status.failed -gt 0) {
        Write-Error "grades-create-uuid-extension Job failed. Check the Job logs for details."
        kubectl logs -l job-name=grades-create-uuid-extension -n default
        exit 1
    }
    Write-Host "Waiting... ($($i * 10) seconds)"
    Start-Sleep -Seconds 10
}

if (-not $extensionJobComplete) {
    Write-Error "grades-create-uuid-extension Job did not complete within the timeout."
    exit 1
}

# Apply the grades-service resources
kubectl apply -f grades-deployment.yaml
Write-Host "Applied grades-deployment.yaml"

kubectl apply -f grades-service.yaml
Write-Host "Applied grades-service.yaml"

# Apply the grades migration Job
kubectl apply -f grades-migration-job.yaml -n default
Write-Host "Applied grades-migration-job.yaml"

# Wait for the grades migration Job to complete successfully
Write-Host "Waiting for grades-migration Job to complete..."
$migrationJobComplete = $false
for ($i = 0; $i -lt 60; $i++) { # Try for up to 10 minutes
    $status = kubectl get job grades-db-migrate -n default -o json | ConvertFrom-Json
    if ($status.status.succeeded -eq 1) {
        $migrationJobComplete = $true
        Write-Host "Grades database migrations completed successfully!"
        break
    }
    if ($status.status.failed -gt 0) {
        Write-Error "Grades database migration Job failed. Check the Job logs for details."
        kubectl logs -l job-name=grades-db-migrate -n default
        exit 1
    }
    Write-Host "Waiting for migrations... ($($i * 10) seconds)"
    Start-Sleep -Seconds 10
}

if (-not $migrationJobComplete) {
    Write-Error "Grades database migration Job did not complete within the timeout."
    exit 1
}

Write-Host "All resources applied and migrations completed successfully!"