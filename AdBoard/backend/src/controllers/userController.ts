import { Request, Response } from 'express';
import { User } from '../models';
import { logger } from '../config/logger';

/**
 * Get all users
 */
export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json(users);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting users: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting user: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Create new user
 */
export const createUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    
    const user = new User({
      username,
      email,
      password, // Note: In a real app, this should be hashed
      role: role || 'user'
    });
    
    await user.save();
    
    // Don't return the password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return res.status(201).json(userResponse);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error creating user: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update user
 */
export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username, email, role } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    
    await user.save();
    
    // Don't return the password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return res.status(200).json(userResponse);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error updating user: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete user
 */
export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error deleting user: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
