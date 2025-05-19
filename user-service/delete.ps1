# Delete User Service resources
kubectl delete -f user-service.yaml -n default
Write-Host "Deleted user-service."

kubectl delete -f user-deployment.yaml -n default
Write-Host "Deleted user-service-deployment."

# Delete User Service migration Job
kubectl delete -f user-migration-job.yaml -n default
Write-Host "Deleted user-migration-job."

# Delete PostgreSQL resources for User Service
kubectl delete -f user-db-service.yaml -n default
Write-Host "Deleted user-db-service."

kubectl delete -f user-db-deployment.yaml -n default
Write-Host "Deleted user-db-deployment."

kubectl delete -f user-db-pvc.yaml -n default
Write-Host "Deleted user-db-pvc."

Write-Host "All User Service related resources deleted successfully!"