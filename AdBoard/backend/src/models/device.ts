import mongoose, { Document, Schema } from "mongoose";

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
