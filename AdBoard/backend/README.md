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

## Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose ODM
- MQTT for real-time communication
- JWT for authentication
- Winston for logging

## Setup & Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Copy `.env.example` to `.env` and update variables as needed
4. Run `npm run dev` for development

## Directory Structure

```
src/
 ├── config/       # Application configuration
 ├── controllers/  # Route controllers
 ├── middleware/   # Express middleware
 ├── models/       # Mongoose models
 ├── routes/       # Express routes
 ├── services/     # Business logic
 ├── utils/        # Utility functions
 └── server.js     # Entry point
```

## Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with hot reload
- `npm test`: Run tests
