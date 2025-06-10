import express from "express";
import { UserController } from "../controllers/userController";
import { authenticateToken, isAdmin } from "../middleware/auth";

export const createUserRoutes = (userController: UserController): express.Router => {
  const router = express.Router();

  // GET all users - Admin only
  router.get("/", authenticateToken, isAdmin, userController.getAllUsers);

  // GET user by ID
  router.get("/:id", authenticateToken, userController.getUserById);

  // POST create user - Admin only
  router.post("/", authenticateToken, isAdmin, userController.createUser);

  // PUT update user - Admin only
  router.put("/:id", authenticateToken, isAdmin, userController.updateUser);

  // DELETE user - Admin only
  router.delete("/:id", authenticateToken, isAdmin, userController.deleteUser);

  return router;
};
