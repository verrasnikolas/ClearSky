# Apply the api-gateway-service resources
kubectl apply -f api-gateway-deployment.yaml
Write-Host "Applied api-gateway-deployment.yaml"

kubectl apply -f api-gateway-service.yaml
Write-Host "Applied api-gateway-service.yaml"