import { Request, Response } from 'express';
import { logger } from '../config/logger';
import * as uploadUtils from '../utils/upload';

/**
 * Upload a file
 */
export const uploadFile = async (req: Request, res: Response): Promise<Response> => {
  try {
    // File will be processed by multer middleware
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Return the file info
    return res.status(201).json({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error uploading file: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete a file
 */
export const deleteFile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { filename } = req.params;
    
    await uploadUtils.deleteFile(filename);
    
    return res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error deleting file: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
