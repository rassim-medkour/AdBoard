 import mongoose, { Document, Schema } from 'mongoose';
import { IContent } from './content';

export interface ICampaign extends Document {
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: Date;
  endDate: Date;
  targetDevices: string[];
  contents: mongoose.Types.ObjectId[] | IContent[];
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema: Schema = new Schema({
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
    enum: ['draft', 'active', 'paused', 'completed'],
    default: 'draft',
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  targetDevices: [{
    type: String,
    required: true,
  }],
  contents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
  }],
}, { 
  timestamps: true 
});

export default mongoose.model<ICampaign>('Campaign', CampaignSchema);
