# Delete api-gateway-service related resources
kubectl delete -f api-gateway-service.yaml -n default
Write-Host "Deleted api-gateway-service resources."

kubectl delete -f api-gateway-deployment.yaml -n default
Write-Host "Deleted api-gateway-deployment resources."

Write-Host "All specified resources deleted successfully!"