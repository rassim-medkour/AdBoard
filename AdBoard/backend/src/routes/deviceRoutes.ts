import express from "express";
import * as deviceController from "../controllers/deviceController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Devices
 *   description: API for managing display devices
 */

/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: Get all devices
 *     tags: [Devices]
 *     responses:
 *       200:
 *         description: List of all devices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Device'
 *       500:
 *         description: Server error
 */
router.get("/", deviceController.getAllDevices);

/**
 * @swagger
 * /api/devices/{id}:
 *   get:
 *     summary: Get device by MongoDB ID
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the device
 *     responses:
 *       200:
 *         description: Device details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       404:
 *         description: Device not found
 *       500:
 *         description: Server error
 */
router.get("/:id", deviceController.getDeviceById);

/**
 * @swagger
 * /api/devices/by-device-id/{deviceId}:
 *   get:
 *     summary: Get device by unique device identifier
 *     tags: [Devices]
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
 *       404:
 *         description: Device not found
 *       500:
 *         description: Server error
 */
router.get("/by-device-id/:deviceId", deviceController.getDeviceByDeviceId);

/**
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
 *                 description: Current device status
 *               screenOrientation:
 *                 type: string
 *                 enum: [landscape, portrait]
 *                 description: Screen orientation
 *               screenResolution:
 *                 type: string
 *                 description: Screen resolution (e.g. 1920x1080)
 *     responses:
 *       201:
 *         description: Device created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", deviceController.createDevice);

/**
 * @swagger
 * /api/devices/{id}:
 *   put:
 *     summary: Update a device by MongoDB ID
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the device
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
 *                 description: Physical location of the device
 *               status:
 *                 type: string
 *                 enum: [online, offline, maintenance]
 *                 description: Current device status
 *               screenOrientation:
 *                 type: string
 *                 enum: [landscape, portrait]
 *                 description: Screen orientation
 *               screenResolution:
 *                 type: string
 *                 description: Screen resolution (e.g. 1920x1080)
 *     responses:
 *       200:
 *         description: Device updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Device not found
 *       500:
 *         description: Server error
 */
router.put("/:id", deviceController.updateDevice);

/**
 * @swagger
 * /api/devices/status/{deviceId}:
 *   put:
 *     summary: Update a device status by device identifier
 *     tags: [Devices]
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [online, offline, maintenance]
 *                 description: New device status
 *     responses:
 *       200:
 *         description: Device status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Device not found
 *       500:
 *         description: Server error
 */
router.put("/status/:deviceId", deviceController.updateDeviceStatus);

/**
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
 *         description: MongoDB ID of the device
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
router.delete("/:id", deviceController.deleteDevice);

export default router;
