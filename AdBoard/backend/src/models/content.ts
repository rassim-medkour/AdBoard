import mongoose, { Document, Schema } from "mongoose";

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
