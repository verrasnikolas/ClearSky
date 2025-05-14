kubectl apply -f grades-service\postgres-pvc.yaml
kubectl apply -f grades-service\postgres-deployment.yaml
kubectl apply -f grades-service\postgres-service.yaml
kubectl apply -f grades-service\grades-deployment.yaml
kubectl apply -f grades-service\grades-service.yaml

# Apply PostgreSQL related resources
kubectl apply -f review_service\postgres-pvc.yaml
kubectl apply -f review_service\postgres-deployment.yaml
kubectl apply -f review_service\postgres-service.yaml

# Apply review-service related resources
kubectl apply -f review_service\review-deployment.yaml
kubectl apply -f review_service\review-service.yaml

# stats
kubectl apply -f statistics-service\stats-deployment.yaml
kubectl apply -f statistics-service\stats-service.yaml


Write-Host "All resources applied successfully!"