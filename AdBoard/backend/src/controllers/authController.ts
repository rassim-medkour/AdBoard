import { Request, Response } from "express";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models";
import { logger } from "../config/logger";

interface UserDocument extends Document {
  password?: string;
  [key: string]: any;
}

/**
 * User registration
 */
export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: "user", // Default role
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as Secret,
      {
        expiresIn: process.env.JWT_EXPIRY || "24h",
      } as SignOptions
    );

    // Don't return the password
    const userResponse = user.toObject();
    const { password: _, ...userWithoutPassword } = userResponse;

    return res.status(201).json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error registering user: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * User login
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as Secret,
      {
        expiresIn: process.env.JWT_EXPIRY || "24h",
      } as SignOptions
    );

    // Don't return the password
    const userResponse = user.toObject();
    const { password: _, ...userWithoutPassword } = userResponse;

    return res.status(200).json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error logging in: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
