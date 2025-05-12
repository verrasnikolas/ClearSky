kubectl apply -f postgres-pvc.yaml
kubectl apply -f postgres-deployment.yaml
kubectl apply -f postgres-service.yaml
kubectl apply -f grades-deployment.yaml
kubectl apply -f grades-service.yaml

Write-Host "All resources applied successfully!"