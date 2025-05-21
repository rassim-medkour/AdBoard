import mqtt from "mqtt";
import { logger } from "./logger";

let client: mqtt.MqttClient | null = null;

interface MqttOptions {
  clientId: string;
  clean: boolean;
  connectTimeout: number;
  username?: string;
  password?: string;
  reconnectPeriod: number;
}

/**
 * Connect to the MQTT broker
 */
export const connect = (): Promise<mqtt.MqttClient> => {
  return new Promise((resolve, reject) => {
    try {
      // Get MQTT configuration from environment variables
      const { MQTT_BROKER_URL, MQTT_USERNAME, MQTT_PASSWORD, MQTT_CLIENT_ID } =
        process.env; // Configure MQTT connection options
      const options: MqttOptions = {
        clientId:
          MQTT_CLIENT_ID ||
          `adboard-server-${Math.random().toString(16).substr(2, 8)}`,
        clean: true,
        connectTimeout: 30000, // Increased timeout for more stability
        username: MQTT_USERNAME,
        password: MQTT_PASSWORD,
        reconnectPeriod: 5000, // Longer reconnect period
      };

      if (!MQTT_BROKER_URL) {
        throw new Error(
          "MQTT_BROKER_URL is not defined in environment variables"
        );
      } // Connect to MQTT broker
      const mqttUrl = MQTT_BROKER_URL as string;
      client = mqtt.connect(mqttUrl, options);

      // Set up event handlers with proper error handling
      client.on("connect", () => {
        logger.info(`Connected to MQTT broker: ${mqttUrl}`);

        // Subscribe to relevant topics with error handling
        client!.subscribe("adboard/devices/#", { qos: 1 }, (err) => {
          if (!err) {
            logger.info("Subscribed to device topics");
          } else {
            logger.error(`Error subscribing to device topics: ${err.message}`);
          }
        });

        resolve(client!);
      });

      client.on("error", (err) => {
        logger.error(`MQTT connection error: ${err.message}`);
        reject(err);
      });

      client.on("offline", () => {
        logger.warn("MQTT client offline");
      });

      client.on("reconnect", () => {
        logger.info("MQTT client reconnecting");
      });
    } catch (error) {
      const err = error as Error;
      logger.error(`Error setting up MQTT: ${err.message}`);
      reject(err);
    }
  });
};

/**
 * Disconnect from the MQTT broker
 */
export const disconnect = (): Promise<void> => {
  return new Promise((resolve) => {
    if (client && client.connected) {
      client.end(false, () => {
        logger.info("Disconnected from MQTT broker");
        resolve();
      });
    } else {
      logger.warn("MQTT client not connected, nothing to disconnect");
      resolve();
    }
  });
};

/**
 * Publish a message to a topic
 *
 * @param {string} topic - The topic to publish to
 * @param {object|string} message - The message to publish
 * @param {object} options - MQTT publish options
 * @returns {Promise<void>}
 */
export const publish = (
  topic: string,
  message: object | string,
  options: mqtt.IClientPublishOptions = { qos: 1, retain: false }
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!client || !client.connected) {
      reject(new Error("MQTT client not connected"));
      return;
    }

    const payload =
      typeof message === "object" ? JSON.stringify(message) : message;

    client.publish(topic, payload, options, (err) => {
      if (err) {
        logger.error(`Error publishing to ${topic}: ${err.message}`);
        reject(err);
      } else {
        logger.debug(`Published to ${topic}: ${payload}`);
        resolve();
      }
    });
  });
};

/**
 * Get MQTT client instance
 */
export const getClient = (): mqtt.MqttClient | null => client;
