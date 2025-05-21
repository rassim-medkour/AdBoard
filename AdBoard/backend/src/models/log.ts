import mongoose, { Document, Schema } from 'mongoose';

export interface ILog extends Document {
  level: 'info' | 'warn' | 'error';
  message: string;
  deviceId?: string;
  campaignId?: mongoose.Types.ObjectId;
  contentId?: mongoose.Types.ObjectId;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const LogSchema: Schema = new Schema({
  level: {
    type: String,
    enum: ['info', 'warn', 'error'],
    default: 'info',
  },
  message: {
    type: String,
    required: true,
  },
  deviceId: {
    type: String,
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
  },
  metadata: {
    type: Object,
  },
}, { 
  timestamps: true 
});

export default mongoose.model<ILog>('Log', LogSchema);
