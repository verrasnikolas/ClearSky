cd grades-service
docker build -t grades-service:latest .
cd ..

cd review_service
docker build -t review-service:latest .
cd ..

cd statisticss-service
docker build -t stats-service:latest .
cd ..