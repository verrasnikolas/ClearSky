cd api-gateway
./delete.sh
cd ..

cd grades-service
./delete.sh
cd ..

cd review_service
./delete.sh
cd ..

cd statistics-service
./delete.sh
cd ..

cd upload-service
./delete.sh
cd ..

cd user-service
./delete.sh
cd ..

cd clearsky-frontend
./delete.sh
cd ..

#docker stop rabbitmq
#docker rm rabbitmq
kubectl delete deployment rabbitmq

echo "All resources deleted successfully!"