// models/Media.ts
import mongoose, { Document, Model } from "mongoose";

export interface IMedia {
  userId: string;
  fileName: string;
  url: string;
  type?: string;
  size?: number;
  createdAt?: Date;
  // add any other fields you use
}

export interface IMediaDocument extends IMedia, Document {}

const MediaSchema = new mongoose.Schema<IMediaDocument>({
  userId: { type: String, required: true },
  fileName: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String },
  size: { type: Number },
}, { timestamps: { createdAt: true, updatedAt: false } });

// reuse existing model when available (prevents OverwriteModelError in dev/hot-reload)
const Media: Model<IMediaDocument> =
  (mongoose.models.Media as Model<IMediaDocument>) ||
  mongoose.model<IMediaDocument>("Media", MediaSchema);

export default Media;