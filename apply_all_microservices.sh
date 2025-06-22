# Rabbit MQ
kubectl apply -f rabbitmq-deployment.yaml
echo "Applied rabbitmq-deployment.yaml"
kubectl apply -f rabbitmq-service.yaml
echo "Applied rabbitmq-service.yaml"

cd clearsky-frontend
./apply.sh
cd ..

cd api-gateway
./apply.sh
cd ..

cd grades-service
./apply.sh
cd ..

cd review_service
./apply.sh
cd ..

cd statistics-service
./apply.sh
cd ..

cd upload-service
./apply.sh
cd ..

cd user-service
./apply.sh
cd ..

echo "All resources applied successfully!"