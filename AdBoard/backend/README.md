# AdBoard Backend

A lightweight, open-source digital signage ad server backend that enables real-time content delivery to distributed display screens using MQTT.

## Features

- RESTful API for campaign management
- MQTT-based content delivery mechanism
- Authentication and authorization
- Media content upload and management
- Screen management and grouping
- Scheduling and targeting capabilities
- Comprehensive logging and monitoring
- API documentation with Swagger/OpenAPI

## Tech Stack

- TypeScript
- Node.js & Express.js
- MongoDB with Mongoose ODM
- MQTT for real-time communication
- JWT for authentication
- Swagger/OpenAPI for API documentation
- Winston for logging
- Docker & Docker Compose for containerization

## Running with Docker

The entire application stack can be run using Docker Compose:

```bash
# From the root directory (one level above backend)
docker-compose up -d
```

This will start:

- MongoDB database
- Mosquitto MQTT broker
- Backend API server

To stop the containers:

```bash
docker-compose down
```

To rebuild the backend container after code changes:

```bash
docker-compose up -d --build backend
```

## Setup & Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Copy `.env.example` to `.env` and update variables as needed
4. Run `npm run dev` for development

## API Documentation

The API is fully documented using Swagger/OpenAPI. You can access the interactive documentation at:

```
http://localhost:3000/api/docs
```

The Swagger UI provides:
- Complete endpoint documentation
- Request/response schema details
- Authentication requirements
- Interactive testing of API endpoints
- Example requests and responses

### Updating Documentation

The API documentation is generated from JSDoc-style comments in the code. When adding or modifying endpoints:

1. Add or update the Swagger JSDoc comments in the controller files
2. Use proper annotations for parameters, request bodies, and responses
3. Include examples where helpful
4. Restart the server to see changes

Example of a documented endpoint:

```typescript
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
```

## Directory Structure

```
src/
 ├── config/       # Application configuration
 ├── controllers/  # Route controllers
 ├── middleware/   # Express middleware
 ├── models/       # Mongoose models
 ├── routes/       # Express routes
 ├── services/     # Business logic
 ├── types/        # TypeScript type definitions
 ├── utils/        # Utility functions
 └── server.ts     # Entry point
```

## Scripts

- `npm start`: Start production server
- `npm run build`: Build TypeScript code
- `npm run dev`: Start development server with hot reload
- `npm test`: Run tests
- `npm run lint`: Run ESLint
- `npm run clean`: Clean build directory
- `npm run docker:up`: Start Docker containers
- `npm run docker:down`: Stop Docker containers
- `npm run docker:logs`: View Docker container logs
- `npm run docker:prod`: Start Docker containers in production mode
