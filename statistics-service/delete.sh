#!/bin/bash

# Delete stats-service related resources
kubectl delete -f stats-service.yaml -n default
echo "Deleted stats-service resources."

kubectl delete -f stats-deployment.yaml -n default
echo "Deleted stats-deployment resources."

# Delete PostgreSQL related resources
kubectl delete -f stats-db-service.yaml -n default
echo "Deleted stats-db-service resources."

kubectl delete -f stats-db-deployment.yaml -n default
echo "Deleted stats-db-deployment resources."

kubectl delete -f stats-db-pvc.yaml -n default
echo "Deleted stats-db-pvc resources."

kubectl delete -f stats-migrate-job.yaml -n default
echo "Deleted stats-migration-job resources."

# Delete the create-uuid-extension Job as well
kubectl delete -f stats-create-uuid-extension-job.yaml -n default
echo "Deleted stats-create-uuid-extension-job resources."

echo "All specified resources deleted successfully!"