# Delete review-service related resources
kubectl delete -f stats-service.yaml
kubectl delete -f stats-deployment.yaml

# Delete PostgreSQL related resources
kubectl delete -f stats-postgres-service.yaml
kubectl delete -f stats-postgres-deployment.yaml

Write-Host "All resources deleted successfully!"
