#!/bin/bash

# Apply the api-gateway-service resources
kubectl apply -f api-gateway-deployment.yaml -n default
echo "Applied api-gateway-deployment.yaml"

kubectl apply -f api-gateway-service.yaml -n default
echo "Applied api-gateway-service.yaml"