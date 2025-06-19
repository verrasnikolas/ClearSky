# Apply PostgreSQL related resources
kubectl apply -f review-db-pvc.yaml
kubectl apply -f review-db-deployment.yaml
kubectl apply -f review-db-service.yaml

# Apply review-service related resources
kubectl apply -f review-deployment.yaml
kubectl apply -f review-service.yaml

Write-Host "All resources applied successfully!"