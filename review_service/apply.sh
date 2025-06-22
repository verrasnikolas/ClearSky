#!/bin/bash

# Apply PostgreSQL related resources
kubectl apply -f review-db-pvc.yaml -n default
kubectl apply -f review-db-deployment.yaml -n default
kubectl apply -f review-db-service.yaml -n default

# Apply review-service related resources
kubectl apply -f review-deployment.yaml -n default
kubectl apply -f review-service.yaml -n default

echo "All resources applied successfully!"