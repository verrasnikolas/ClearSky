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

docker stop rabbitmq
docker rm rabbitmq

Write-Host "All resources deleted successfully!"