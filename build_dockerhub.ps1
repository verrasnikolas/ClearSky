cd api-gateway
docker build -t jimkam5/api-gateway:latest .
docker push jimkam5/api-gateway:latest
cd ..

cd grades-service
docker build -t jimkam5/grades-service:latest .
docker push jimkam5/grades-service:latest
cd ..

cd review_service
docker build -t jimkam5/review_service:latest .
docker push jimkam5/review_service:latest
cd ..

cd statistics-service
docker build -t jimkam5/stats-service:latest .
docker push jimkam5/statistics-service:latest
cd ..

cd upload-service
docker build -t jimkam5/upload-service:latest .
docker push jimkam5/upload-service:latest
cd ..

cd user-service
docker build -t jimkam5/user-service:latest .
docker push jimkam5/user-service:latest
cd ..

cd clearsky-frontend
docker build -t jimkam5/clearsky-frontend:latest .
docker push jimkam5/clearsky-frontend:latest
cd ..