import express from 'express';
import * as contentController from '../controllers/contentController';

const router = express.Router();

// GET all content
router.get('/', contentController.getAllContent);

// GET content by ID
router.get('/:id', contentController.getContentById);

// POST create content
router.post('/', contentController.createContent);

// PUT update content
router.put('/:id', contentController.updateContent);

// DELETE content
router.delete('/:id', contentController.deleteContent);

export default router;
