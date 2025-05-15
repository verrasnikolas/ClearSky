docker run -d --hostname rabbit-host --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management


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

Write-Host "All resources applied successfully!"