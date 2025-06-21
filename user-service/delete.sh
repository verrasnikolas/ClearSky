#!/bin/bash

# Delete User Service resources
kubectl delete -f user-service.yaml -n default
echo "Deleted user-service."

kubectl delete -f user-deployment.yaml -n default
echo "Deleted user-service-deployment."

# Delete User Service migration Job
kubectl delete -f user-migration-job.yaml -n default
echo "Deleted user-migration-job."

# Delete PostgreSQL resources for User Service
kubectl delete -f user-db-service.yaml -n default
echo "Deleted user-db-service."

kubectl delete -f user-db-deployment.yaml -n default
echo "Deleted user-db-deployment."

kubectl delete -f user-db-pvc.yaml -n default
echo "Deleted user-db-pvc."

echo "All User Service related resources deleted successfully!"