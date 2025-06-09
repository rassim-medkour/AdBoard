import { BaseEntity } from "./BaseEntity";

/**
 * Device domain entity
 * Represents a physical display device in the system
 */
export interface DeviceEntity extends BaseEntity {
  deviceId: string;
  name: string;
  location: string;
  description?: string;
  status: "online" | "offline" | "maintenance";
  lastSeen?: Date;
  deviceModel?: string;
  screenSize?: string;
  orientation?: "portrait" | "landscape";
  resolution?: string;
}

/**
 * Device creation input DTO
 */
export interface CreateDeviceDto {
  deviceId: string;
  name: string;
  location: string;
  description?: string;
  status?: "online" | "offline" | "maintenance";
  deviceModel?: string;
  screenSize?: string;
  orientation?: "portrait" | "landscape";
  resolution?: string;
}

/**
 * Device update input DTO
 * All fields are optional for partial updates
 */
export interface UpdateDeviceDto {
  deviceId?: string;
  name?: string;
  location?: string;
  description?: string;
  status?: "online" | "offline" | "maintenance";
  lastSeen?: Date;
  deviceModel?: string;
  screenSize?: string;
  orientation?: "portrait" | "landscape";
  resolution?: string;
}
