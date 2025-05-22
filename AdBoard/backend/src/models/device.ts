import mongoose, { Document, Schema } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Device:
 *       type: object
 *       required:
 *         - name
 *         - deviceId
 *         - location
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         name:
 *           type: string
 *           description: Device name
 *         deviceId:
 *           type: string
 *           description: Unique device identifier
 *         location:
 *           type: string
 *           description: Physical location of the device
 *         status:
 *           type: string
 *           enum: [online, offline, maintenance]
 *           description: Current device status
 *           default: offline
 *         lastSeen:
 *           type: string
 *           format: date-time
 *           description: Last time the device connected to the server
 *         screenOrientation:
 *           type: string
 *           enum: [landscape, portrait]
 *           description: Screen orientation of the device
 *           default: landscape
 *         screenResolution:
 *           type: string
 *           description: Screen resolution in format WIDTHxHEIGHT (e.g., 1920x1080)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       example:
 *         _id: 6476d20ca72e1a842f58a8d6
 *         name: Lobby Display
 *         deviceId: display-001
 *         location: Main Building Lobby
 *         status: online
 *         lastSeen: 2025-05-21T08:15:30.123Z
 *         screenOrientation: landscape
 *         screenResolution: 1920x1080
 *         createdAt: 2025-05-01T09:30:00.000Z
 *         updatedAt: 2025-05-21T08:15:30.123Z
 */

export interface IDevice extends Document {
  name: string;
  deviceId: string;
  location: string;
  status: "online" | "offline" | "maintenance";
  lastSeen: Date;
  screenOrientation: "landscape" | "portrait";
  screenResolution: string;
  createdAt: Date;
  updatedAt: Date;
}

const DeviceSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    deviceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["online", "offline", "maintenance"],
      default: "offline",
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    screenOrientation: {
      type: String,
      enum: ["landscape", "portrait"],
      default: "landscape",
    },
    screenResolution: {
      type: String,
      default: "1920x1080",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDevice>("Device", DeviceSchema);
