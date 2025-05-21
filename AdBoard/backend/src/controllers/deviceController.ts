import { Request, Response } from 'express';
import { Device } from '../models';
import { logger } from '../config/logger';

/**
 * Get all devices
 */
export const getAllDevices = async (req: Request, res: Response): Promise<Response> => {
  try {
    const devices = await Device.find();
    return res.status(200).json(devices);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting devices: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get device by ID
 */
export const getDeviceById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    return res.status(200).json(device);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting device: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get device by deviceId
 */
export const getDeviceByDeviceId = async (req: Request, res: Response): Promise<Response> => {
  try {
    const device = await Device.findOne({ deviceId: req.params.deviceId });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    return res.status(200).json(device);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting device: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Create new device
 */
export const createDevice = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, deviceId, location, screenOrientation, screenResolution } = req.body;
    
    // Check if device already exists
    const existingDevice = await Device.findOne({ deviceId });
    if (existingDevice) {
      return res.status(400).json({ message: 'Device ID already exists' });
    }
    
    const device = new Device({
      name,
      deviceId,
      location,
      screenOrientation: screenOrientation || 'landscape',
      screenResolution: screenResolution || '1920x1080',
      status: 'offline',
      lastSeen: new Date()
    });
    
    await device.save();
    return res.status(201).json(device);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error creating device: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update device
 */
export const updateDevice = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, location, status, screenOrientation, screenResolution } = req.body;
    
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    if (name) device.name = name;
    if (location) device.location = location;
    if (status) device.status = status;
    if (screenOrientation) device.screenOrientation = screenOrientation;
    if (screenResolution) device.screenResolution = screenResolution;
    
    // Update lastSeen if status is changing to online
    if (status === 'online') {
      device.lastSeen = new Date();
    }
    
    await device.save();
    return res.status(200).json(device);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error updating device: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update device status
 */
export const updateDeviceStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { deviceId } = req.params;
    const { status } = req.body;
    
    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    device.status = status || 'online';
    device.lastSeen = new Date();
    
    await device.save();
    return res.status(200).json(device);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error updating device status: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete device
 */
export const deleteDevice = async (req: Request, res: Response): Promise<Response> => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    return res.status(200).json({ message: 'Device deleted successfully' });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error deleting device: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
