# Delete stats-service related resources
kubectl delete -f stats-service.yaml -n default
Write-Host "Deleted stats-service resources."

kubectl delete -f stats-deployment.yaml -n default
Write-Host "Deleted stats-deployment resources."

# Delete PostgreSQL related resources
kubectl delete -f stats-postgres-service.yaml -n default
Write-Host "Deleted stats-postgres-service resources."

kubectl delete -f stats-postgres-deployment.yaml -n default
Write-Host "Deleted stats-postgres-deployment resources."

kubectl delete -f stats-postgres-pvc.yaml -n default
Write-Host "Deleted stats-postgres-pvc resources."

kubectl delete -f stats-migrate-job.yaml -n default
Write-Host "Deleted stats-migration-job resources."

# Delete the create-uuid-extension Job as well
kubectl delete -f create-uuid-extension-job.yaml -n default
Write-Host "Deleted create-uuid-extension-job resources."

Write-Host "All specified resources deleted successfully!"