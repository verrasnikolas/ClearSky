#!/bin/bash

# Delete api-gateway-service related resources
kubectl delete -f api-gateway-service.yaml -n default
echo "Deleted api-gateway-service resources."

kubectl delete -f api-gateway-deployment.yaml -n default
echo "Deleted api-gateway-deployment resources."

echo "All specified resources deleted successfully!"