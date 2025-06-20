cd api-gateway
docker build -t api-gateway-service:latest .
cd ..

cd grades-service
docker build -t grades-service:latest .
cd ..

cd review_service
docker build -t review-service:latest .
cd ..

cd statistics-service
docker build -t stats-service:latest .
cd ..

cd upload-service
docker build -t upload-service:latest .
cd ..

cd user-service
docker build -t user-service:latest .
cd ..

#cd clearsky-frontend
#docker build -t clearsky-frontend:latest .
#cd ..