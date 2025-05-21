import { Request, Response } from 'express';
import { Content, Campaign } from '../models';
import { logger } from '../config/logger';
import mongoose from 'mongoose';

/**
 * Get all content
 */
export const getAllContent = async (req: Request, res: Response): Promise<Response> => {
  try {
    const content = await Content.find();
    return res.status(200).json(content);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting content: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get content by ID
 */
export const getContentById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    return res.status(200).json(content);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting content: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Create new content
 */
export const createContent = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { title, description, contentType, url, duration, status } = req.body;
    
    const content = new Content({
      title,
      description,
      contentType,
      url,
      duration: duration || 10,
      status: status || 'active'
    });
    
    await content.save();
    return res.status(201).json(content);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error creating content: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update content
 */
export const updateContent = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { title, description, contentType, url, duration, status } = req.body;
    
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    if (title) content.title = title;
    if (description) content.description = description;
    if (contentType) content.contentType = contentType as 'image' | 'video' | 'html' | 'url';
    if (url) content.url = url;
    if (duration) content.duration = duration;
    if (status) content.status = status as 'active' | 'inactive';
    
    await content.save();
    return res.status(200).json(content);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error updating content: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete content
 */
export const deleteContent = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Check if content is used in any campaigns
    const contentId = new mongoose.Types.ObjectId(req.params.id);
    const campaigns = await Campaign.find({ contents: contentId });
    
    if (campaigns.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete content that is used in campaigns',
        campaigns: campaigns.map(c => ({ id: c._id, name: c.name }))
      });
    }
    
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    return res.status(200).json({ message: 'Content deleted successfully' });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error deleting content: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
