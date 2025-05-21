# AdBoard Digital Signage System

A complete digital signage solution with MQTT-based content delivery for distributed display screens.

## Project Structure

- `AdBoard/backend/` - Node.js backend API server
- `AdBoard/frontend/` - Frontend application
- `AdBoard/client-mock/` - Client simulator for testing
- `mosquitto/` - MQTT broker configuration
- `docker-compose.yml` - Docker Compose configuration for the entire stack

## Requirements

- Docker and Docker Compose
- Node.js (for local development)

## Getting Started

### Running with Docker

1. Clone this repository
2. Start the entire stack:
   ```bash
   docker-compose up -d
   ```
3. For development mode with hot-reloading:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
   ```
4. Access the backend API at http://localhost:3000
5. The MongoDB service is available at localhost:27017 (credentials: root/rootpassword)
6. The MQTT broker is available at:
   - MQTT protocol: localhost:1883
   - WebSockets protocol: localhost:9001

### Development Workflow

For local development without Docker:

1. Install MongoDB locally or use the containerized version:

   ```bash
   docker-compose up -d mongodb
   ```

2. Install backend dependencies:
   ```bash
   cd AdBoard/backend
   npm install
   npm run dev
   ```

## Stopping Services

To stop all services:

```bash
docker-compose down
```

To stop a single service:

```bash
docker-compose stop [service_name]
```

## Viewing Logs

```bash
# View logs for all services
docker-compose logs

# View logs for a specific service
docker-compose logs -f [service_name]
```
