// Define global type declarations here

import { Secret } from "jsonwebtoken";

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    PORT: string;
    MONGODB_URI: string;
    JWT_SECRET: Secret;
    JWT_EXPIRY: string;
    MQTT_BROKER_URL: string;
    MQTT_USERNAME: string;
    MQTT_PASSWORD: string;
    MQTT_CLIENT_ID: string;
    UPLOAD_DIR?: string;
    MAX_FILE_SIZE?: string;
  }
}
