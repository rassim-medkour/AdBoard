import { BaseEntity } from './BaseEntity';

/**
 * Content domain entity
 * Represents media content that can be displayed on devices
 */
export interface ContentEntity extends BaseEntity {
  title: string;
  description?: string;
  type: 'image' | 'video' | 'html' | 'url';
  url: string; // File path or external URL
  duration?: number; // Duration in seconds for videos
  size?: number; // File size in bytes
  format?: string; // File format or MIME type
  status: 'active' | 'inactive';
  metadata?: Record<string, any>; // Additional metadata
}

/**
 * Content creation input DTO
 */
export interface CreateContentDto {
  title: string;
  description?: string;
  type: 'image' | 'video' | 'html' | 'url';
  url: string;
  duration?: number;
  size?: number;
  format?: string;
  status?: 'active' | 'inactive';
  metadata?: Record<string, any>;
}

/**
 * Content update input DTO
 * All fields are optional for partial updates
 */
export interface UpdateContentDto {
  title?: string;
  description?: string;
  type?: 'image' | 'video' | 'html' | 'url';
  url?: string;
  duration?: number;
  size?: number;
  format?: string;
  status?: 'active' | 'inactive';
  metadata?: Record<string, any>;
}
