import express from "express";
import * as deviceController from "../controllers/deviceController";

const router = express.Router();

// GET all devices
router.get("/", deviceController.getAllDevices);

// GET device by ID
router.get("/:id", deviceController.getDeviceById);

// GET device by deviceId
router.get("/by-device-id/:deviceId", deviceController.getDeviceByDeviceId);

// POST create device
router.post("/", deviceController.createDevice);

// PUT update device
router.put("/:id", deviceController.updateDevice);

// PUT update device status by deviceId
router.put("/status/:deviceId", deviceController.updateDeviceStatus);

// DELETE device
router.delete("/:id", deviceController.deleteDevice);

export default router;
