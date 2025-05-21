import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { logger } from './config/logger';
import * as mqtt from './config/mqtt';
import routes from './routes';
import path from 'path';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api', routes);

// Basic route for testing
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to AdBoard Digital Signage Server API' });
});

// Start the server
async function startServer(): Promise<void> {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Connect to MQTT broker
    await mqtt.connect();
    
    // Start listening
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server');
    logger.error(error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Shutting down gracefully...');
  // Close server, database connections, etc.
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received. Shutting down gracefully...');
  // Close server, database connections, etc.
  process.exit(0);
});

// Uncaught exception handler
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:');
  logger.error(error);
  process.exit(1);
});

// Start the application
startServer();
