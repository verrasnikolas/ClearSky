# Delete grades-service related resources
kubectl delete -f grades-service.yaml -n default
Write-Host "Deleted grades-service resources."

kubectl delete -f grades-deployment.yaml -n default
Write-Host "Deleted grades-deployment resources."

# Delete PostgreSQL related resources
kubectl delete -f postgres-service.yaml -n default
Write-Host "Deleted grades-postgres-service resources."

kubectl delete -f postgres-deployment.yaml -n default
Write-Host "Deleted grades-postgres-deployment resources."

kubectl delete -f postgres-pvc.yaml -n default
Write-Host "Deleted grades-postgres-pvc resources."

kubectl delete -f grades-migration-job.yaml -n default
Write-Host "Deleted grades-migration-job resources."

# Delete the create-uuid-extension Job as well
kubectl delete -f create-uuid-extension-job.yaml -n default
Write-Host "Deleted create-uuid-extension-job resources."

Write-Host "All specified resources deleted successfully!"