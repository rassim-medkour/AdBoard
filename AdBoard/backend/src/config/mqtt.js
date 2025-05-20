const mqtt = require('mqtt');
const { logger } = require('./logger');

let client = null;

/**
 * Connect to the MQTT broker
 */
const connect = () => {
  return new Promise((resolve, reject) => {
    try {
      // Get MQTT configuration from environment variables
      const {
        MQTT_BROKER_URL,
        MQTT_USERNAME,
        MQTT_PASSWORD,
        MQTT_CLIENT_ID
      } = process.env;

      // Configure MQTT connection options
      const options = {
        clientId: MQTT_CLIENT_ID || `adboard-server-${Math.random().toString(16).substr(2, 8)}`,
        clean: true,
        connectTimeout: 4000,
        username: MQTT_USERNAME,
        password: MQTT_PASSWORD,
        reconnectPeriod: 1000,
      };

      // Connect to MQTT broker
      client = mqtt.connect(MQTT_BROKER_URL, options);

      // Handle connection events
      client.on('connect', () => {
        logger.info(`Connected to MQTT broker: ${MQTT_BROKER_URL}`);
        
        // Subscribe to key topics
        client.subscribe('adboard/screens/+/status', { qos: 1 });
        client.subscribe('adboard/screens/+/logs', { qos: 0 });
        
        logger.info('Subscribed to core MQTT topics');
        resolve();
      });

      // Handle error events
      client.on('error', (err) => {
        logger.error(`MQTT client error: ${err.message}`);
        reject(err);
      });

      // Handle incoming messages
      client.on('message', (topic, message) => {
        logger.debug(`MQTT message received on ${topic}: ${message.toString()}`);
        
        // Process messages based on topic
        if (topic.match(/adboard\/screens\/.*\/status/)) {
          const screenId = topic.split('/')[2];
          try {
            const status = JSON.parse(message.toString());
            // Will handle screen status updates in a dedicated service
            logger.info(`Screen ${screenId} reported status: ${status.state}`);
          } catch (error) {
            logger.error(`Error parsing status message from screen ${screenId}: ${error.message}`);
          }
        }
      });
      
    } catch (error) {
      logger.error(`Failed to connect to MQTT broker: ${error.message}`);
      reject(error);
    }
  });
};

/**
 * Disconnect from the MQTT broker
 */
const disconnect = () => {
  return new Promise((resolve) => {
    if (client && client.connected) {
      client.end(true, () => {
        logger.info('Disconnected from MQTT broker');
        resolve();
      });
    } else {
      logger.info('No active MQTT connection to disconnect');
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
const publish = (topic, message, options = { qos: 1, retain: false }) => {
  return new Promise((resolve, reject) => {
    if (!client || !client.connected) {
      reject(new Error('MQTT client not connected'));
      return;
    }

    const payload = typeof message === 'object' ? JSON.stringify(message) : message;

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

module.exports = {
  connect,
  disconnect,
  publish,
  getClient: () => client
};
