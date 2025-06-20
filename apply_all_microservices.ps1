# Rabbit MQ
kubectl apply -f rabbitmq-deployment.yaml
Write-Host "Applied rabbitmq-deployment.yaml"
kubectl apply -f rabbitmq-service.yaml
Write-Host "Applied rabbitmq-service.yaml"

cd api-gateway
./apply
cd ..

cd grades-service
./apply
cd ..

cd review_service
./apply
cd ..

cd statistics-service
./apply
cd ..

cd upload-service
./apply
cd ..

cd user-service
./apply
cd ..

Write-Host "All resources applied successfully!"