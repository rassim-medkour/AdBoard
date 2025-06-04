import mongoose from "mongoose";
import { logger } from "./logger";
import { config } from "./app";

/**
 * Connects to MongoDB using the URI from centralized configuration
 */
export const connectDB = async (): Promise<mongoose.Connection> => {
  try {
    if (!config.database.uri) {
      throw new Error("Database URI is not defined in configuration");
    }
    // Updated connection options for Mongoose 8
    const conn = await mongoose.connect(config.database.uri);

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    const err = error as Error;
    logger.error(`Error connecting to MongoDB: ${err.message}`);
    throw err;
  }
};

/**
 * Closes the MongoDB connection
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info("MongoDB connection closed");
  } catch (error) {
    const err = error as Error;
    logger.error(`Error disconnecting from MongoDB: ${err.message}`);
  }
};
