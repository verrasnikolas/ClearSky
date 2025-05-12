# Apply PostgreSQL related resources
kubectl apply -f postgres-pvc.yaml
kubectl apply -f postgres-deployment.yaml
kubectl apply -f postgres-service.yaml

# Apply review-service related resources
kubectl apply -f review-deployment.yaml
kubectl apply -f review-service.yaml

Write-Host "All resources applied successfully!"