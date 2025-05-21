#!/bin/bash

echo "Starting AdBoard Digital Signage System..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Docker is not running. Please start Docker and try again."
  exit 1
fi

# Starting in development mode
echo "Starting in development mode..."
docker-compose up -d

# Show logs (optional)
read -p "Do you want to see the logs? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  docker-compose logs -f
fi

echo ""
echo "AdBoard Digital Signage System is running!"
echo "Access the backend API at: http://localhost:3000"
echo "MongoDB is available at: localhost:27017"
echo "MQTT broker is available at: localhost:1883 (TCP), localhost:9001 (WebSocket)"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
