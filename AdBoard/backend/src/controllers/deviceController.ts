import { Request, Response } from "express";
import { logger } from "../config/logger";
import { DeviceService } from "../services/DeviceService";

export class DeviceController {
  private deviceService: DeviceService;

  constructor(deviceService: DeviceService) {
    this.deviceService = deviceService;
  }

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
  getAllDevices = async (req: Request, res: Response): Promise<Response> => {
    try {
      const devices = await this.deviceService.getAllDevices();
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
  getDeviceById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const device = await this.deviceService.getDeviceById(req.params.id);
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
  getDeviceByDeviceId = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const device = await this.deviceService.getDeviceByDeviceId(
        req.params.deviceId
      );
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
      return res.status(200).json(device);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error getting device by deviceId: ${err.message}`);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  /**
   * Get devices by status
   * @swagger
   * /api/devices/status/{status}:
   *   get:
   *     summary: Get devices by status
   *     tags: [Devices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: status
   *         required: true
   *         schema:
   *           type: string
   *           enum: [online, offline, maintenance]
   *         description: Device status
   *     responses:
   *       200:
   *         description: List of devices with the specified status
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
  getDevicesByStatus = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const status = req.params.status as "online" | "offline" | "maintenance";
      const devices = await this.deviceService.getDevicesByStatus(status);
      return res.status(200).json(devices);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error getting devices by status: ${err.message}`);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  /**
   * Get devices by location
   * @swagger
   * /api/devices/location/{location}:
   *   get:
   *     summary: Get devices by location
   *     tags: [Devices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: location
   *         required: true
   *         schema:
   *           type: string
   *         description: Device location
   *     responses:
   *       200:
   *         description: List of devices at the specified location
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
  getDevicesByLocation = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const devices = await this.deviceService.getDevicesByLocation(
        req.params.location
      );
      return res.status(200).json(devices);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error getting devices by location: ${err.message}`);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  /**
   * Create new device
   * @swagger
   * /api/devices:
   *   post:
   *     summary: Create new device
   *     tags: [Devices]
   *     security:
   *       - bearerAuth: []
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
   *               deviceId:
   *                 type: string
   *                 description: Unique device identifier
   *               location:
   *                 type: string
   *                 description: Device location
   *               description:
   *                 type: string
   *                 description: Device description
   *               status:
   *                 type: string
   *                 enum: [online, offline, maintenance]
   *                 description: Device status
   *               deviceModel:
   *                 type: string
   *                 description: Device model
   *               screenSize:
   *                 type: string
   *                 description: Screen size
   *               orientation:
   *                 type: string
   *                 enum: [portrait, landscape]
   *                 description: Screen orientation
   *               resolution:
   *                 type: string
   *                 description: Screen resolution
   *             required:
   *               - name
   *               - deviceId
   *               - location
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
  createDevice = async (req: Request, res: Response): Promise<Response> => {
    try {
      const {
        name,
        deviceId,
        location,
        description,
        status,
        deviceModel,
        screenSize,
        orientation,
        resolution,
      } = req.body;

      const device = await this.deviceService.createDevice({
        name,
        deviceId,
        location,
        description,
        status,
        deviceModel,
        screenSize,
        orientation,
        resolution,
      });

      return res.status(201).json(device);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error creating device: ${err.message}`);

      // Return appropriate status code based on error type
      if (err.message.includes("already exists")) {
        return res.status(400).json({ message: err.message });
      }

      return res.status(500).json({ message: "Internal server error" });
    }
  };

  /**
   * Update device
   * @swagger
   * /api/devices/{id}:
   *   put:
   *     summary: Update device
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
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Device name
   *               deviceId:
   *                 type: string
   *                 description: Unique device identifier
   *               location:
   *                 type: string
   *                 description: Device location
   *               description:
   *                 type: string
   *                 description: Device description
   *               status:
   *                 type: string
   *                 enum: [online, offline, maintenance]
   *                 description: Device status
   *               deviceModel:
   *                 type: string
   *                 description: Device model
   *               screenSize:
   *                 type: string
   *                 description: Screen size
   *               orientation:
   *                 type: string
   *                 enum: [portrait, landscape]
   *                 description: Screen orientation
   *               resolution:
   *                 type: string
   *                 description: Screen resolution
   *     responses:
   *       200:
   *         description: Device updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Device'
   *       400:
   *         description: Invalid input or device ID conflict
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Device not found
   *       500:
   *         description: Server error
   */
  updateDevice = async (req: Request, res: Response): Promise<Response> => {
    try {
      const {
        name,
        deviceId,
        location,
        description,
        status,
        deviceModel,
        screenSize,
        orientation,
        resolution,
      } = req.body;

      const device = await this.deviceService.updateDevice(req.params.id, {
        name,
        deviceId,
        location,
        description,
        status,
        deviceModel,
        screenSize,
        orientation,
        resolution,
      });

      return res.status(200).json(device);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error updating device: ${err.message}`);

      // Return appropriate status code based on error type
      if (err.message.includes("not found")) {
        return res.status(404).json({ message: err.message });
      }

      if (err.message.includes("already exists")) {
        return res.status(400).json({ message: err.message });
      }

      return res.status(500).json({ message: "Internal server error" });
    }
  };

  /**
   * Update device status
   * @swagger
   * /api/devices/{deviceId}/status:
   *   patch:
   *     summary: Update device status
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
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [online, offline, maintenance]
   *                 description: New device status
   *               lastPing:
   *                 type: string
   *                 format: date-time
   *                 description: Timestamp of last ping
   *             required:
   *               - status
   *     responses:
   *       200:
   *         description: Device status updated successfully
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
  updateDeviceStatus = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { status, lastPing } = req.body;
      const deviceId = req.params.deviceId;

      const device = await this.deviceService.updateDeviceStatus(
        deviceId,
        status,
        lastPing ? new Date(lastPing) : undefined
      );

      return res.status(200).json(device);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error updating device status: ${err.message}`);

      // Return appropriate status code based on error type
      if (err.message.includes("not found")) {
        return res.status(404).json({ message: err.message });
      }

      return res.status(500).json({ message: "Internal server error" });
    }
  };

  /**
   * Delete device
   * @swagger
   * /api/devices/{id}:
   *   delete:
   *     summary: Delete device
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
  deleteDevice = async (req: Request, res: Response): Promise<Response> => {
    try {
      await this.deviceService.deleteDevice(req.params.id);
      return res.status(200).json({ message: "Device deleted successfully" });
    } catch (error) {
      const err = error as Error;
      logger.error(`Error deleting device: ${err.message}`);

      // Return appropriate status code based on error type
      if (err.message.includes("not found")) {
        return res.status(404).json({ message: "Device not found" });
      }

      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
