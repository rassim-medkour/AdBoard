#!/bin/bash

echo "Stopping existing containers..."
docker-compose down

echo "Rebuilding containers..."
docker-compose build --no-cache

echo "Starting containers..."
docker-compose up -d

echo "Checking logs for backend service..."
docker-compose logs -f backend
