import express from 'express';
import userRoutes from './userRoutes';
import deviceRoutes from './deviceRoutes';
import contentRoutes from './contentRoutes';
import campaignRoutes from './campaignRoutes';
import authRoutes from './authRoutes';
import uploadRoutes from './uploadRoutes';

const router = express.Router();

// Root API route
router.get('/', (req, res) => {
  res.json({
    message: 'AdBoard API',
    version: '1.0.0',
    endpoints: [
      '/api/auth',
      '/api/users',
      '/api/devices',
      '/api/content',
      '/api/campaigns',
      '/api/uploads',
    ]
  });
});

// Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/devices', deviceRoutes);
router.use('/content', contentRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/uploads', uploadRoutes);

export default router;
