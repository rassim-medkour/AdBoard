import mongoose from "mongoose";
import { logger } from "./logger";

/**
 * Connects to MongoDB using the URI from environment variables
 */
export const connectDB = async (): Promise<mongoose.Connection> => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    // Updated connection options for Mongoose 8
    const conn = await mongoose.connect(process.env.MONGODB_URI);

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
