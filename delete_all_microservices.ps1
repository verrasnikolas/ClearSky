# Delete review-service related resources
kubectl delete -f grades-service\grades-service.yaml
kubectl delete -f grades-service\grades-deployment.yaml

# Delete PostgreSQL related resources
kubectl delete -f grades-service\postgres-service.yaml
kubectl delete -f grades-service\postgres-deployment.yaml
kubectl delete -f grades-service\postgres-pvc.yaml

kubectl delete -f review_service\review-service.yaml
kubectl delete -f review_service\review-deployment.yaml

# Delete PostgreSQL related resources
kubectl delete -f review_service\postgres-service.yaml
kubectl delete -f review_service\postgres-deployment.yaml
kubectl delete -f review_service\postgres-pvc.yaml

Write-Host "All resources deleted successfully!"