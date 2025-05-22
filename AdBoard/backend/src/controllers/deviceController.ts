import { Request, Response } from "express";
import { Device } from "../models";
import { logger } from "../config/logger";

/**
 * Get all devices
 * @swagger
 * /api/devices:
 *   get:
 *     summary: Get all devices
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of devices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Device'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const getAllDevices = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const devices = await Device.find();
    return res.status(200).json(devices);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting devices: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get device by ID
 * @swagger
 * /api/devices/{id}:
 *   get:
 *     summary: Get device by ID
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Device MongoDB ID
 *     responses:
 *       200:
 *         description: Device details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Device not found
 *       500:
 *         description: Server error
 */
export const getDeviceById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }
    return res.status(200).json(device);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting device: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get device by deviceId
 * @swagger
 * /api/devices/device/{deviceId}:
 *   get:
 *     summary: Get device by deviceId
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique device identifier
 *     responses:
 *       200:
 *         description: Device details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Device not found
 *       500:
 *         description: Server error
 */
export const getDeviceByDeviceId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const device = await Device.findOne({ deviceId: req.params.deviceId });
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }
    return res.status(200).json(device);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting device: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Create new device
 * @swagger
 * /api/devices:
 *   post:
 *     summary: Create a new device
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - deviceId
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *                 description: Device name
 *               deviceId:
 *                 type: string
 *                 description: Unique device identifier
 *               location:
 *                 type: string
 *                 description: Physical location of the device
 *               status:
 *                 type: string
 *                 enum: [online, offline, maintenance]
 *                 description: Device status
 *               screenOrientation:
 *                 type: string
 *                 enum: [landscape, portrait]
 *                 description: Screen orientation
 *               screenResolution:
 *                 type: string
 *                 description: Screen resolution (e.g., 1920x1080)
 *     responses:
 *       201:
 *         description: Device created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       400:
 *         description: Invalid input or device already exists
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const createDevice = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, deviceId, location, screenOrientation, screenResolution } =
      req.body;

    // Check if device already exists
    const existingDevice = await Device.findOne({ deviceId });
    if (existingDevice) {
      return res.status(400).json({ message: "Device ID already exists" });
    }

    const device = new Device({
      name,
      deviceId,
      location,
      screenOrientation: screenOrientation || "landscape",
      screenResolution: screenResolution || "1920x1080",
      status: "offline",
      lastSeen: new Date(),
    });

    await device.save();
    return res.status(201).json(device);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error creating device: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Update device
 * @swagger
 * /api/devices/{id}:
 *   put:
 *     summary: Update a device
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Device name
 *               location:
 *                 type: string
 *                 description: Physical location of the device
 *               status:
 *                 type: string
 *                 enum: [online, offline, maintenance]
 *                 description: Device status
 *               screenOrientation:
 *                 type: string
 *                 enum: [landscape, portrait]
 *                 description: Screen orientation
 *               screenResolution:
 *                 type: string
 *                 description: Screen resolution (e.g., 1920x1080)
 *     responses:
 *       200:
 *         description: Device updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Device not found
 *       500:
 *         description: Server error
 */
export const updateDevice = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, location, status, screenOrientation, screenResolution } =
      req.body;

    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    if (name) device.name = name;
    if (location) device.location = location;
    if (status) device.status = status;
    if (screenOrientation) device.screenOrientation = screenOrientation;
    if (screenResolution) device.screenResolution = screenResolution;

    // Update lastSeen if status is changing to online
    if (status === "online") {
      device.lastSeen = new Date();
    }

    await device.save();
    return res.status(200).json(device);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error updating device: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Update device status
 * @swagger
 * /api/devices/{id}/status:
 *   patch:
 *     summary: Update device status
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [online, offline, maintenance]
 *                 description: Device status
 *     responses:
 *       200:
 *         description: Device status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Device not found
 *       500:
 *         description: Server error
 */
export const updateDeviceStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { deviceId } = req.params;
    const { status } = req.body;

    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    device.status = status || "online";
    device.lastSeen = new Date();

    await device.save();
    return res.status(200).json(device);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error updating device status: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Delete device
 * @swagger
 * /api/devices/{id}:
 *   delete:
 *     summary: Delete a device
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID
 *     responses:
 *       200:
 *         description: Device deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Device not found
 *       500:
 *         description: Server error
 */
export const deleteDevice = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }
    return res.status(200).json({ message: "Device deleted successfully" });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error deleting device: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
