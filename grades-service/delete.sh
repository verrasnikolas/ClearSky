#!/bin/bash

# Delete grades-service related resources
kubectl delete -f grades-service.yaml -n default
echo "Deleted grades-service resources."

kubectl delete -f grades-deployment.yaml -n default
echo "Deleted grades-deployment resources."

# Delete PostgreSQL related resources
kubectl delete -f grades-db-service.yaml -n default
echo "Deleted grades-db-service resources."

kubectl delete -f grades-db-deployment.yaml -n default
echo "Deleted grades-db-deployment resources."

kubectl delete -f grades-db-pvc.yaml -n default
echo "Deleted grades-db-pvc resources."

kubectl delete -f grades-migration-job.yaml -n default
echo "Deleted grades-migration-job resources."

# Delete the create-uuid-extension Job as well
kubectl delete -f grades-create-uuid-extension-job.yaml -n default
echo "Deleted grades-create-uuid-extension-job resources."

echo "All specified resources deleted successfully!"