import { Request, Response } from "express";
import { User } from "../models";
import { logger } from "../config/logger";

/**
 * Get all users
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Not logged in
 *       403:
 *         description: Forbidden - Not an admin
 *       500:
 *         description: Server error
 */
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting users: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });  }
};

/**
 * Get user by ID
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
export const getUserById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting user: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });  }
};

/**
 * Create new user
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 description: User's role
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not an admin
 *       409:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
export const createUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const user = new User({
      username,
      email,
      password, // Note: In a real app, this should be hashed
      role: role || "user",
    });

    await user.save();

    // Don't return the password
    const userResponse = user.toObject();
    const { password: _, ...userWithoutPassword } = userResponse;

    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error creating user: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Update user
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 description: User's role
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not an admin
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { username, email, role } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();

    // Don't return the password
    const userResponse = user.toObject();
    const { password: _, ...userWithoutPassword } = userResponse;

    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error updating user: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });  }
};

/**
 * Delete user
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not an admin
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error deleting user: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
