import mongoose, { Document, Schema } from "mongoose";
import { IContent } from "./content";

/**
 * @swagger
 * components:
 *   schemas:
 *     Campaign:
 *       type: object
 *       required:
 *         - name
 *         - status
 *         - startDate
 *         - endDate
 *         - targetDevices
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         name:
 *           type: string
 *           description: Campaign name
 *         description:
 *           type: string
 *           description: Campaign description
 *         status:
 *           type: string
 *           enum: [draft, active, paused, completed]
 *           description: Campaign status
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Campaign start date
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Campaign end date
 *         targetDevices:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of device IDs targeted by this campaign
 *         contents:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of content IDs included in this campaign
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       example:
 *         _id: 6476d20ca72e1a842f58a8c5
 *         name: Summer Sale Campaign
 *         description: Promotions for the summer sale event
 *         status: active
 *         startDate: 2025-06-01T00:00:00.000Z
 *         endDate: 2025-06-30T23:59:59.999Z
 *         targetDevices: ['device1234', 'device5678']
 *         contents: ['6476d20ca72e1a842f58a8b4', '6476d20ca72e1a842f58a8b5']
 *         createdAt: 2025-05-20T12:30:45.678Z
 *         updatedAt: 2025-05-20T12:30:45.678Z
 */

export interface ICampaign extends Document {
  name: string;
  description?: string;
  status: "draft" | "active" | "paused" | "completed";
  startDate: Date;
  endDate: Date;
  targetDevices: string[];
  contents: mongoose.Types.ObjectId[] | IContent[];
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "active", "paused", "completed"],
      default: "draft",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    targetDevices: [
      {
        type: String,
        required: true,
      },
    ],
    contents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Content",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICampaign>("Campaign", CampaignSchema);
