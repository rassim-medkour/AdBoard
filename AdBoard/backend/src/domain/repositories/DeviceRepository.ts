import { BaseRepository } from './BaseRepository';
import { DeviceEntity, CreateDeviceDto, UpdateDeviceDto } from '../entities/DeviceEntity';

/**
 * Device repository interface
 * Extends the base repository with device-specific operations
 */
export interface DeviceRepository extends BaseRepository<DeviceEntity> {
  /**
   * Find a device by its unique device ID
   * @param deviceId - The device ID to search for
   * @returns Promise resolving to the device or null if not found
   */
  findByDeviceId(deviceId: string): Promise<DeviceEntity | null>;
  
  /**
   * Find devices by status
   * @param status - The status to filter by
   * @returns Promise resolving to an array of devices
   */
  findByStatus(status: 'online' | 'offline' | 'maintenance'): Promise<DeviceEntity[]>;
  
  /**
   * Find devices by location
   * @param location - The location to filter by
   * @returns Promise resolving to an array of devices
   */
  findByLocation(location: string): Promise<DeviceEntity[]>;
  
  /**
   * Update device status
   * @param deviceId - The device ID
   * @param status - The new status
   * @param lastPing - The timestamp of the last ping
   * @returns Promise resolving to the updated device or null if not found
   */
  updateStatus(deviceId: string, status: 'online' | 'offline' | 'maintenance', lastPing?: Date): Promise<DeviceEntity | null>;
}
