#!/bin/bash

# Ensure 'jq' is installed for JSON parsing
if ! command -v jq &> /dev/null
then
    echo "Error: 'jq' is not installed. Please install it using 'brew install jq' (macOS) or your system's package manager." >&2
    exit 1
fi

# Apply PostgreSQL resources
kubectl apply -f grades-db-pvc.yaml -n default
echo "Applied grades-db-pvc.yaml"

kubectl apply -f grades-db-deployment.yaml -n default
echo "Applied grades-db-deployment.yaml"

kubectl apply -f grades-db-service.yaml -n default
echo "Applied grades-db-service.yaml"

---

# Wait for the grades-db deployment to be ready
echo "Waiting for grades-db to be ready..."
postgresReady=false
for i in $(seq 1 30); do # Try for up to 5 minutes (30 * 10 seconds)
    readyReplicas=$(kubectl get deployment grades-db -n default -o json | jq -r '.status.readyReplicas // 0')
    specReplicas=$(kubectl get deployment grades-db -n default -o json | jq -r '.spec.replicas // 0')

    if [[ "$readyReplicas" -eq "$specReplicas" && "$readyReplicas" -gt 0 ]]; then
        postgresReady=true
        echo "grades-db is ready."
        break
    fi
    echo "Waiting... $((i * 10)) seconds"
    sleep 10
done

if [ "$postgresReady" = false ]; then
    echo "Error: grades-db did not become ready within the timeout." >&2
    exit 1
fi

---

# Apply the Job to create the uuid-ossp extension
kubectl apply -f grades-create-uuid-extension-job.yaml -n default
echo "Applied grades-create-uuid-extension-job.yaml"

# Wait for the create-uuid-extension Job to complete successfully
echo "Waiting for grades-create-uuid-extension Job to complete..."
extensionJobComplete=false
for i in $(seq 1 30); do # Try for up to 5 minutes
    jobSucceeded=$(kubectl get job grades-create-uuid-extension -n default -o json | jq -r '.status.succeeded // 0')
    jobFailed=$(kubectl get job grades-create-uuid-extension -n default -o json | jq -r '.status.failed // 0')

    if [ "$jobSucceeded" -eq 1 ]; then
        extensionJobComplete=true
        echo "uuid-ossp extension created successfully."
        break
    fi
    if [ "$jobFailed" -gt 0 ]; then
        echo "Error: grades-create-uuid-extension Job failed. Check the Job logs for details." >&2
        kubectl logs job/grades-create-uuid-extension -n default
        exit 1
    fi
    echo "Waiting... $((i * 10)) seconds"
    sleep 10
done

if [ "$extensionJobComplete" = false ]; then
    echo "Error: grades-create-uuid-extension Job did not complete within the timeout." >&2
    exit 1
fi

---

# Apply the grades-service resources
kubectl apply -f grades-deployment.yaml -n default
echo "Applied grades-deployment.yaml"

kubectl apply -f grades-service.yaml -n default
echo "Applied grades-service.yaml"

---

# Apply the grades migration Job
kubectl apply -f grades-migration-job.yaml -n default
echo "Applied grades-migration-job.yaml"

# Wait for the grades migration Job to complete successfully
echo "Waiting for grades-migration Job to complete..."
migrationJobComplete=false
for i in $(seq 1 60); do # Try for up to 10 minutes
    jobSucceeded=$(kubectl get job grades-db-migrate -n default -o json | jq -r '.status.succeeded // 0')
    jobFailed=$(kubectl get job grades-db-migrate -n default -o json | jq -r '.status.failed // 0')

    if [ "$jobSucceeded" -eq 1 ]; then
        migrationJobComplete=true
        echo "Grades database migrations completed successfully!"
        break
    fi
    if [ "$jobFailed" -gt 0 ]; then
        echo "Error: Grades database migration Job failed. Check the Job logs for details." >&2
        kubectl logs job/grades-db-migrate -n default
        exit 1
    fi
    echo "Waiting for migrations... $((i * 10)) seconds"
    sleep 10
done

if [ "$migrationJobComplete" = false ]; then
    echo "Error: Grades database migration Job did not complete within the timeout." >&2
    exit 1
fi

echo "All resources applied and migrations completed successfully!"