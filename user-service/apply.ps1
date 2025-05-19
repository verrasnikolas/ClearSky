# Apply PostgreSQL resources for User Service
kubectl apply -f user-db-pvc.yaml -n default
Write-Host "Applied user-db-pvc.yaml"

kubectl apply -f user-db-deployment.yaml -n default
Write-Host "Applied user-db-deployment.yaml"

kubectl apply -f user-db-service.yaml -n default
Write-Host "Applied user-db-service.yaml"

# Wait for the user-db deployment to be ready *and* the Pod to be running and ready
Write-Host "Waiting for user-db deployment and pod to be ready..."
$userDbReady = $false
for ($i = 0; $i -lt 30; $i++) {
    $deploymentStatus = kubectl get deployment user-db-deployment -n default -o json | ConvertFrom-Json
    $podStatus = kubectl get pod -l app=user-db -n default -o json | ConvertFrom-Json #get the pod

    # Check deployment status
    $deploymentReady = ($deploymentStatus.status.readyReplicas -eq $deploymentStatus.spec.replicas)

    # Check pod status.  Make sure there is at least one pod, and that it is running.
    $podReady = ($podStatus.items.Count -gt 0) -and ($podStatus.items[0].status.phase -eq "Running")

    if ($deploymentReady -and $podReady) {
        $userDbReady = $true
        Write-Host "user-db deployment and pod are ready."
        break
    }
    Write-Host "Waiting... ($($i * 10) seconds)"
    Start-Sleep -Seconds 10
}

if (-not $userDbReady) {
    Write-Error "user-db deployment or pod did not become ready within the timeout."
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
for ($i = 0; $i -lt 60; $i++) {
    $status = kubectl get job user-migration-job -n default -o json | ConvertFrom-Json
    if ($status.status.succeeded -eq 1) {
        $userMigrationJobComplete = $true
        Write-Host "User database migrations completed successfully!"
        break
    }
    if ($status.status.failed -gt 0) {
        Write-Error "User database migration Job failed.  Checking Job logs..."
        kubectl logs job/user-migration-job -n default # Changed to 'job/user-migration-job'
        Write-Error "User database migration Job failed.  Check the Job logs for details."
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
