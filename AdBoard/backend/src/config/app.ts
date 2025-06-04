/**
 * Application Configuration
 * Centralized configuration for the application
 */
export interface AppConfig {
  port: number;
  environment: string;
  database: {
    uri: string;
  };
  mqtt: {
    broker: string;
    port: number;
    username?: string;
    password?: string;
    clientId?: string;
  };
  upload: {
    maxFileSize: number;
    allowedTypes: string[];
  };
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || "3000", 10),
  environment: process.env.NODE_ENV || "development",
  database: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/adboard",
  },
  mqtt: {
    broker: process.env.MQTT_BROKER || "localhost",
    port: parseInt(process.env.MQTT_PORT || "1883", 10),
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    clientId: process.env.MQTT_CLIENT_ID,
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760", 10), // 10MB
    allowedTypes: ["image/jpeg", "image/png", "video/mp4", "video/webm"],
  },
};
