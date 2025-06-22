cd api-gateway
./delete
cd ..

cd grades-service
./delete
cd ..

cd review_service
./delete
cd ..

cd statistics-service
./delete
cd ..

cd upload-service
./delete
cd ..

cd user-service
./delete
cd ..

cd clearsky-frontend
./delete
cd ..

#docker stop rabbitmq
#docker rm rabbitmq
kubectl delete deployment rabbitmq
kubectl delete service rabbitmq

Write-Host "All resources deleted successfully!"