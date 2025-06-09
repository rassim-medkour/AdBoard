import { Model } from "mongoose";
import { Device, IDevice } from "../models";
import { DeviceEntity } from "../domain/entities/DeviceEntity";
import { DeviceRepository } from "../domain/repositories/DeviceRepository";

/**
 * MongoDB implementation of the DeviceRepository interface
 */
export class MongoDeviceRepository implements DeviceRepository {
  private deviceModel: Model<IDevice>;

  /**
   * Creates a new MongoDeviceRepository
   * @param deviceModel - The Mongoose model to use (defaults to Device)
   */
  constructor(deviceModel = Device) {
    this.deviceModel = deviceModel;
  }
  /**
   * Converts a Mongoose document to a device entity
   * @param doc - The Mongoose document
   * @returns The device entity or null if the document is null
   */
  private toEntity(doc: any): DeviceEntity | null {
    if (!doc) return null;

    return {
      id: doc._id.toString(),
      name: doc.name,
      deviceId: doc.deviceId,
      location: doc.location,
      description: doc.description,
      status: doc.status,
      lastSeen: doc.lastSeen,
      screenSize: doc.screenSize,
      orientation: doc.orientation,
      resolution: doc.resolution,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  /**
   * Finds all devices
   * @returns Promise resolving to an array of device entities
   */
  async findAll(): Promise<DeviceEntity[]> {
    const devices = await this.deviceModel.find();
    return devices
      .map((device) => this.toEntity(device))
      .filter((device): device is DeviceEntity => device !== null);
  }

  /**
   * Finds a device by ID
   * @param id - The device ID
   * @returns Promise resolving to the device entity or null if not found
   */
  async findById(id: string): Promise<DeviceEntity | null> {
    const device = await this.deviceModel.findById(id);
    return this.toEntity(device);
  }

  /**
   * Finds a device by deviceId
   * @param deviceId - The unique device identifier
   * @returns Promise resolving to the device entity or null if not found
   */
  async findByDeviceId(deviceId: string): Promise<DeviceEntity | null> {
    const device = await this.deviceModel.findOne({ deviceId });
    return this.toEntity(device);
  }

  /**
   * Finds devices by status
   * @param status - The status to filter by
   * @returns Promise resolving to an array of device entities
   */
  async findByStatus(
    status: "online" | "offline" | "maintenance"
  ): Promise<DeviceEntity[]> {
    const devices = await this.deviceModel.find({ status });
    return devices
      .map((device) => this.toEntity(device))
      .filter((device): device is DeviceEntity => device !== null);
  }

  /**
   * Finds devices by location
   * @param location - The location to filter by
   * @returns Promise resolving to an array of device entities
   */
  async findByLocation(location: string): Promise<DeviceEntity[]> {
    const devices = await this.deviceModel.find({ location });
    return devices
      .map((device) => this.toEntity(device))
      .filter((device): device is DeviceEntity => device !== null);
  }

  /**
   * Creates a new device
   * @param data - The device data
   * @returns Promise resolving to the created device entity
   */
  async create(data: Partial<DeviceEntity>): Promise<DeviceEntity> {
    const device = new this.deviceModel(data);
    const savedDevice = await device.save();
    const entity = this.toEntity(savedDevice);
    if (!entity) {
      throw new Error(
        "Failed to create device: Entity conversion returned null"
      );
    }
    return entity;
  }

  /**
   * Updates an existing device
   * @param id - The device ID
   * @param data - The updated device data
   * @returns Promise resolving to the updated device entity or null if not found
   */
  async update(
    id: string,
    data: Partial<DeviceEntity>
  ): Promise<DeviceEntity | null> {
    const updatedDevice = await this.deviceModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return this.toEntity(updatedDevice);
  }

  /**
   * Updates device status and lastSeen timestamp
   * @param deviceId - The unique device identifier
   * @param status - The new status
   * @returns Promise resolving to the updated device entity or null if not found
   */
  async updateStatus(
    deviceId: string,
    status: "online" | "offline" | "maintenance"
  ): Promise<DeviceEntity | null> {
    const updatedDevice = await this.deviceModel.findOneAndUpdate(
      { deviceId },
      {
        status,
        lastSeen: new Date(),
      },
      { new: true }
    );
    return this.toEntity(updatedDevice);
  }

  /**
   * Deletes a device
   * @param id - The device ID
   * @returns Promise resolving to true if successful, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.deviceModel.findByIdAndDelete(id);
    return !!result;
  }
}
