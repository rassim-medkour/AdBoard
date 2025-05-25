import { BaseEntity } from './BaseEntity';

/**
 * Campaign domain entity
 * Represents an advertising campaign that displays content on target devices
 */
export interface CampaignEntity extends BaseEntity {
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: Date;
  endDate: Date;
  targetDevices: string[]; // Array of device IDs
  contentIds: string[]; // Array of content IDs
}

/**
 * Campaign creation input DTO
 */
export interface CreateCampaignDto {
  name: string;
  description?: string;
  status?: 'draft' | 'active' | 'paused' | 'completed';
  startDate: Date;
  endDate: Date;
  targetDevices: string[];
  contentIds: string[];
}

/**
 * Campaign update input DTO
 * All fields are optional for partial updates
 */
export interface UpdateCampaignDto {
  name?: string;
  description?: string;
  status?: 'draft' | 'active' | 'paused' | 'completed';
  startDate?: Date;
  endDate?: Date;
  targetDevices?: string[];
  contentIds?: string[];
}
