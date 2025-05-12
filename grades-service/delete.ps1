# Delete review-service related resources
kubectl delete -f grades-service.yaml
kubectl delete -f grades-deployment.yaml

# Delete PostgreSQL related resources
kubectl delete -f postgres-service.yaml
kubectl delete -f postgres-deployment.yaml
kubectl delete -f postgres-pvc.yaml

Write-Host "All resources deleted successfully!"