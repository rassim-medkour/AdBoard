import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models';
import { logger } from '../config/logger';

// Define interfaces for request with user
export interface AuthRequest extends Request {
  user?: IUser;
}

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET as string, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      
      try {
        // Get user from token payload
        const userId = (decoded as any).userId;
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        
        // Attach user to request object
        req.user = user;
        next();
      } catch (error) {
        logger.error(`Error in auth middleware: ${error}`);
        return res.status(500).json({ message: 'Internal server error' });
      }
    });
  } catch (error) {
    logger.error(`Error in auth middleware: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Middleware to check if user is admin
 */
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): Response | void => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  next();
};
