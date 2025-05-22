import mongoose, { Document, Schema } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Content:
 *       type: object
 *       required:
 *         - title
 *         - contentType
 *         - url
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         title:
 *           type: string
 *           description: Content title
 *         description:
 *           type: string
 *           description: Content description
 *         contentType:
 *           type: string
 *           enum: [image, video, html, url]
 *           description: Type of content
 *         url:
 *           type: string
 *           description: URL or path to content
 *         duration:
 *           type: number
 *           description: Duration in seconds
 *           default: 10
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: Content status
 *           default: active
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       example:
 *         _id: 6476d20ca72e1a842f58a8b4
 *         title: Example Advertisement
 *         description: A promotional banner for example products
 *         contentType: image
 *         url: /uploads/example-image.jpg
 *         duration: 15
 *         status: active
 *         createdAt: 2025-05-20T10:03:22.345Z
 *         updatedAt: 2025-05-20T10:03:22.345Z
 */

export interface IContent extends Document {
  title: string;
  description?: string;
  contentType: "image" | "video" | "html" | "url";
  url: string;
  duration: number;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    contentType: {
      type: String,
      enum: ["image", "video", "html", "url"],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 10,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IContent>("Content", ContentSchema);
