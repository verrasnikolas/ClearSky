#!/bin/bash

# Ensure 'jq' is installed for JSON parsing
if ! command -v jq &> /dev/null
then
    echo "Error: 'jq' is not installed. Please install it using 'brew install jq' (macOS) or your system's package manager." >&2
    exit 1
fi

# Apply PostgreSQL resources
kubectl apply -f stats-db-pvc.yaml -n default
echo "Applied stats-db-pvc.yaml"

kubectl apply -f stats-db-deployment.yaml -n default
echo "Applied stats-db-deployment.yaml"

kubectl apply -f stats-db-service.yaml -n default
echo "Applied stats-db-service.yaml"

# ---

# Wait for the stats-db deployment to be ready
echo "Waiting for stats-db to be ready..."
postgresReady=false
for i in $(seq 1 30); do
    readyReplicas=$(kubectl get deployment stats-db -n default -o json | jq -r '.status.readyReplicas // 0')
    specReplicas=$(kubectl get deployment stats-db -n default -o json | jq -r '.spec.replicas // 0')

    if [[ "$readyReplicas" -eq "$specReplicas" && "$readyReplicas" -gt 0 ]]; then
        postgresReady=true
        echo "stats-db is ready."
        break
    fi
    echo "Waiting... $((i * 10)) seconds"
    sleep 10
done

if [ "$postgresReady" = false ]; then
    echo "Error: stats-db did not become ready within the timeout." >&2
    exit 1
fi

# ---

# Apply the Job to create the uuid-ossp extension
kubectl apply -f stats-create-uuid-extension-job.yaml -n default
echo "Applied stats-create-uuid-extension-job.yaml"

# Wait for the uuid-ossp Job to complete
echo "Waiting for stats-create-uuid-extension Job to complete..."
extensionJobComplete=false
for i in $(seq 1 30); do
    jobSucceeded=$(kubectl get job stats-create-uuid-extension -n default -o json | jq -r '.status.succeeded // 0')
    jobFailed=$(kubectl get job stats-create-uuid-extension -n default -o json | jq -r '.status.failed // 0')

    if [ "$jobSucceeded" -eq 1 ]; then
        extensionJobComplete=true
        echo "uuid-ossp extension created successfully."
        break
    fi
    if [ "$jobFailed" -gt 0 ]; then
        echo "Error: stats-create-uuid-extension Job failed. Check the Job logs for details:" >&2
        kubectl logs job/stats-create-uuid-extension -n default
        exit 1
    fi
    echo "Waiting... $((i * 10)) seconds"
    sleep 10
done

if [ "$extensionJobComplete" = false ]; then
    echo "Error: stats-create-uuid-extension Job did not complete within the timeout." >&2
    exit 1
fi

# ---

# Apply the stats-service resources
kubectl apply -f stats-deployment.yaml -n default
echo "Applied stats-deployment.yaml"

kubectl apply -f stats-service.yaml -n default
echo "Applied stats-service.yaml"

# ---

# Ensure no previous migration job is running
echo "Cleaning up any existing stats-db-migrate Job..."
kubectl delete job stats-db-migrate --ignore-not-found -n default

# Apply the stats migration Job
if ! kubectl apply -f stats-migrate-job.yaml -n default; then
    echo "Error: Failed to apply stats-migrate-job.yaml" >&2
    exit 1
fi
echo "Applied stats-migrate-job.yaml"

# ---

# Wait for the migration pod to be created and initialized
echo "Waiting for stats-db-migrate pod to initialize..."
for j in $(seq 1 30); do
    podCount=$(kubectl get pod -l job-name=stats-db-migrate -n default -o json | jq -r '.items | length // 0')
    podPhase=$(kubectl get pod -l job-name=stats-db-migrate -n default -o json | jq -r '.items[0].status.phase // ""')

    if [[ "$podCount" -gt 0 && "$podPhase" != "Pending" ]]; then
        echo "stats-db-migrate pod is initializing..."
        break
    fi
    echo "Waiting for pod creation... $((j * 5)) seconds"
    sleep 5
done

# ---

# Wait for the migration Job to complete
echo "Waiting for stats-db-migrate Job to complete..."
migrationJobComplete=false
for i in $(seq 1 60); do
    jobSucceeded=$(kubectl get job stats-db-migrate -n default -o json | jq -r '.status.succeeded // 0')
    jobFailed=$(kubectl get job stats-db-migrate -n default -o json | jq -r '.status.failed // 0')

    if [ "$jobSucceeded" -eq 1 ]; then
        migrationJobComplete=true
        echo "Stats database migrations completed successfully!"
        break
    fi
    if [ "$jobFailed" -gt 0 ]; then
        echo "Error: Stats database migration Job failed. Logs:" >&2
        kubectl logs job/stats-db-migrate -n default
        exit 1
    fi
    echo "Waiting for migrations... $((i * 10)) seconds"
    sleep 10
done

if [ "$migrationJobComplete" = false ]; then
    echo "Error: Stats database migration Job did not complete within the timeout." >&2
    # Try to show logs anyway
    kubectl logs job/stats-db-migrate -n default
    exit 1
fi

echo -e "\n✅ All resources applied and migrations completed successfully!"