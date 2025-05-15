kubectl apply -f stats-postgres-deployment.yaml
kubectl apply -f stats-postgres-service.yaml

# Apply review-service related resources
kubectl apply -f stats-deployment.yaml
kubectl apply -f stats-service.yaml

Write-Host "All resources created successfully!"
