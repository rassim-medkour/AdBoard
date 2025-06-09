import { DeviceRepository } from "../domain/repositories/DeviceRepository";
import {
  DeviceEntity,
  CreateDeviceDto,
  UpdateDeviceDto,
} from "../domain/entities/DeviceEntity";
import { logger } from "../config/logger";

/**
 * Device service containing business logic for device operations
 */
export class DeviceService {
  private deviceRepository: DeviceRepository;

  constructor(deviceRepository: DeviceRepository) {
    this.deviceRepository = deviceRepository;
  }

  /**
   * Get all devices
   * @returns Promise resolving to an array of device entities
   */
  async getAllDevices(): Promise<DeviceEntity[]> {
    try {
      const devices = await this.deviceRepository.findAll();
      logger.info(`Retrieved ${devices.length} devices`);
      return devices;
    } catch (error) {
      const err = error as Error;
      logger.error(`Error getting all devices: ${err.message}`);
      throw new Error("Failed to retrieve devices");
    }
  }

  /**
   * Get device by ID
   * @param id - The device ID
   * @returns Promise resolving to the device entity or null if not found
   */
  async getDeviceById(id: string): Promise<DeviceEntity | null> {
    try {
      const device = await this.deviceRepository.findById(id);
      if (device) {
        logger.info(`Retrieved device with ID: ${id}`);
      } else {
        logger.warn(`Device not found with ID: ${id}`);
      }
      return device;
    } catch (error) {
      const err = error as Error;
      logger.error(`Error getting device by ID ${id}: ${err.message}`);
      throw new Error("Failed to retrieve device");
    }
  }

  /**
   * Get device by device ID
   * @param deviceId - The unique device identifier
   * @returns Promise resolving to the device entity or null if not found
   */
  async getDeviceByDeviceId(deviceId: string): Promise<DeviceEntity | null> {
    try {
      const device = await this.deviceRepository.findByDeviceId(deviceId);
      if (device) {
        logger.info(`Retrieved device with deviceId: ${deviceId}`);
      } else {
        logger.warn(`Device not found with deviceId: ${deviceId}`);
      }
      return device;
    } catch (error) {
      const err = error as Error;
      logger.error(
        `Error getting device by deviceId ${deviceId}: ${err.message}`
      );
      throw new Error("Failed to retrieve device");
    }
  }

  /**
   * Get devices by status
   * @param status - The status to filter by
   * @returns Promise resolving to an array of device entities
   */
  async getDevicesByStatus(
    status: "online" | "offline" | "maintenance"
  ): Promise<DeviceEntity[]> {
    try {
      const devices = await this.deviceRepository.findByStatus(status);
      logger.info(`Retrieved ${devices.length} devices with status: ${status}`);
      return devices;
    } catch (error) {
      const err = error as Error;
      logger.error(`Error getting devices by status ${status}: ${err.message}`);
      throw new Error("Failed to retrieve devices by status");
    }
  }

  /**
   * Get devices by location
   * @param location - The location to filter by
   * @returns Promise resolving to an array of device entities
   */
  async getDevicesByLocation(location: string): Promise<DeviceEntity[]> {
    try {
      const devices = await this.deviceRepository.findByLocation(location);
      logger.info(
        `Retrieved ${devices.length} devices at location: ${location}`
      );
      return devices;
    } catch (error) {
      const err = error as Error;
      logger.error(
        `Error getting devices by location ${location}: ${err.message}`
      );
      throw new Error("Failed to retrieve devices by location");
    }
  }

  /**
   * Create a new device
   * @param deviceData - The device creation data
   * @returns Promise resolving to the created device entity
   */
  async createDevice(deviceData: CreateDeviceDto): Promise<DeviceEntity> {
    try {
      // Check if device with same deviceId already exists
      const existingDevice = await this.deviceRepository.findByDeviceId(
        deviceData.deviceId
      );
      if (existingDevice) {
        throw new Error(
          `Device with deviceId '${deviceData.deviceId}' already exists`
        );
      }

      // Set default values if not provided
      const deviceToCreate: Partial<DeviceEntity> = {
        ...deviceData,
        status: deviceData.status || "offline",
        orientation: deviceData.orientation || "landscape",
        resolution: deviceData.resolution || "1920x1080",
      };

      const device = await this.deviceRepository.create(deviceToCreate);
      logger.info(
        `Created device with ID: ${device.id}, deviceId: ${device.deviceId}`
      );
      return device;
    } catch (error) {
      const err = error as Error;
      logger.error(`Error creating device: ${err.message}`);

      // Re-throw specific errors for proper handling
      if (err.message.includes("already exists")) {
        throw err;
      }

      throw new Error("Failed to create device");
    }
  }

  /**
   * Update an existing device
   * @param id - The device ID
   * @param updateData - The device update data
   * @returns Promise resolving to the updated device entity
   */
  async updateDevice(
    id: string,
    updateData: UpdateDeviceDto
  ): Promise<DeviceEntity> {
    try {
      // Check if device exists
      const existingDevice = await this.deviceRepository.findById(id);
      if (!existingDevice) {
        throw new Error(`Device with ID '${id}' not found`);
      }

      // If deviceId is being updated, check for conflicts
      if (
        updateData.deviceId &&
        updateData.deviceId !== existingDevice.deviceId
      ) {
        const conflictingDevice = await this.deviceRepository.findByDeviceId(
          updateData.deviceId
        );
        if (conflictingDevice) {
          throw new Error(
            `Device with deviceId '${updateData.deviceId}' already exists`
          );
        }
      }

      const updatedDevice = await this.deviceRepository.update(id, updateData);
      if (!updatedDevice) {
        throw new Error(`Failed to update device with ID '${id}'`);
      }

      logger.info(`Updated device with ID: ${id}`);
      return updatedDevice;
    } catch (error) {
      const err = error as Error;
      logger.error(`Error updating device with ID ${id}: ${err.message}`);

      // Re-throw specific errors for proper handling
      if (
        err.message.includes("not found") ||
        err.message.includes("already exists")
      ) {
        throw err;
      }

      throw new Error("Failed to update device");
    }
  }

  /**
   * Update device status
   * @param deviceId - The device ID
   * @param status - The new status
   * @param lastPing - Optional timestamp of the last ping
   * @returns Promise resolving to the updated device entity
   */
  async updateDeviceStatus(
    deviceId: string,
    status: "online" | "offline" | "maintenance",
    lastPing?: Date
  ): Promise<DeviceEntity> {
    try {
      const updatedDevice = await this.deviceRepository.updateStatus(
        deviceId,
        status,
        lastPing
      );
      if (!updatedDevice) {
        throw new Error(`Device with deviceId '${deviceId}' not found`);
      }

      logger.info(`Updated status of device ${deviceId} to ${status}`);
      return updatedDevice;
    } catch (error) {
      const err = error as Error;
      logger.error(
        `Error updating device status for deviceId ${deviceId}: ${err.message}`
      );

      // Re-throw specific errors for proper handling
      if (err.message.includes("not found")) {
        throw err;
      }

      throw new Error("Failed to update device status");
    }
  }

  /**
   * Delete a device
   * @param id - The device ID
   * @returns Promise resolving when the device is deleted
   */
  async deleteDevice(id: string): Promise<void> {
    try {
      // Check if device exists
      const existingDevice = await this.deviceRepository.findById(id);
      if (!existingDevice) {
        throw new Error(`Device with ID '${id}' not found`);
      }

      const deleted = await this.deviceRepository.delete(id);
      if (!deleted) {
        throw new Error(`Failed to delete device with ID '${id}'`);
      }

      logger.info(
        `Deleted device with ID: ${id}, deviceId: ${existingDevice.deviceId}`
      );
    } catch (error) {
      const err = error as Error;
      logger.error(`Error deleting device with ID ${id}: ${err.message}`);

      // Re-throw specific errors for proper handling
      if (err.message.includes("not found")) {
        throw err;
      }

      throw new Error("Failed to delete device");
    }
  }
}
