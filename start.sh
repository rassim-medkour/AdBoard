#!/bin/bash

echo "Starting AdBoard Digital Signage System..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Docker is not running. Please start Docker and try again."
  exit 1
fi

# Determine environment (dev or prod)
ENV=${1:-prod}

if [ "$ENV" = "dev" ]; then
  echo "Starting in DEVELOPMENT mode with live reloading..."
  docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
else
  echo "Starting in PRODUCTION mode..."
  docker-compose up -d
fi

echo ""
echo "AdBoard Digital Signage System is running!"
echo "Access the backend API at: http://localhost:3000"
echo "MongoDB is available at: localhost:27017"
echo "MQTT broker is available at: localhost:1883 (TCP), localhost:9001 (WebSocket)"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
