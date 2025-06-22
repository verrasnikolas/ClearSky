#!/bin/bash

# Delete review-service related resources
kubectl delete -f review-service.yaml -n default
kubectl delete -f review-deployment.yaml -n default

# Delete PostgreSQL related resources
kubectl delete -f review-db-service.yaml -n default
kubectl delete -f review-db-deployment.yaml -n default
kubectl delete -f review-db-pvc.yaml -n default

echo "All resources deleted successfully!"
