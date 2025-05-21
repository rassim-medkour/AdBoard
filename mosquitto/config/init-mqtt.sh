#!/bin/sh

# Create necessary MQTT topics
mosquitto_pub -h localhost -p 1883 -t "adboard/devices" -m "Initializing" -r
mosquitto_pub -h localhost -p 1883 -t "adboard/campaigns" -m "Initializing" -r
mosquitto_pub -h localhost -p 1883 -t "adboard/content" -m "Initializing" -r

echo "MQTT topics initialized"
