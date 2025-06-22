#!/bin/bash

# Apply PostgreSQL resources for User Service
kubectl apply -f user-db-pvc.yaml -n default
echo "Applied user-db-pvc.yaml"

kubectl apply -f user-db-deployment.yaml -n default
echo "Applied user-db-deployment.yaml"

kubectl apply -f user-db-service.yaml -n default
echo "Applied user-db-service.yaml"

# ---

# Wait for the user-db deployment to be ready *and* the Pod to be running and ready
echo "Waiting for user-db deployment and pod to be ready..."
userDbReady=false
for i in $(seq 1 30); do
    # Check if deployment is ready
    deployment_ready_replicas=$(kubectl get deployment user-db -n default -o json | jq -r '.status.readyReplicas // 0')
    deployment_spec_replicas=$(kubectl get deployment user-db -n default -o json | jq -r '.spec.replicas // 0')

    # Check if pod is running and ready
    pod_phase=$(kubectl get pod -l app=user-db -n default -o json | jq -r '.items[0].status.phase // ""')
    pod_count=$(kubectl get pod -l app=user-db -n default -o json | jq -r '.items | length // 0')

    if [[ "$deployment_ready_replicas" -eq "$deployment_spec_replicas" ]] && [[ "$pod_count" -gt 0 ]] && [[ "$pod_phase" == "Running" ]]; then
        userDbReady=true
        echo "user-db deployment and pod are ready."
        break
    fi
    echo "Waiting... $((i * 10)) seconds"
    sleep 10
done

if [ "$userDbReady" = false ]; then
    echo "Error: user-db deployment or pod did not become ready within the timeout." >&2
    exit 1
fi

# ---

# Apply the User Service deployment
kubectl apply -f user-deployment.yaml -n default
echo "Applied user-service-deployment.yaml"

# Apply the User Service
kubectl apply -f user-service.yaml -n default
echo "Applied user-service.yaml"

# Apply the User Service migration Job
kubectl apply -f user-migration-job.yaml -n default
echo "Applied user-migration-job.yaml"

# ---

# Wait for the user-migration Job to complete successfully
echo "Waiting for user database migrations to complete..."
userMigrationJobComplete=false
for i in $(seq 1 60); do
    job_succeeded=$(kubectl get job user-migration-job -n default -o json | jq -r '.status.succeeded // 0')
    job_failed=$(kubectl get job user-migration-job -n default -o json | jq -r '.status.failed // 0')

    if [ "$job_succeeded" -eq 1 ]; then
        userMigrationJobComplete=true
        echo "User database migrations completed successfully!"
        break
    fi
    if [ "$job_failed" -gt 0 ]; then
        echo "Error: User database migration Job failed. Checking Job logs..."