import { Router } from 'express';
import { ResourceController } from '../controllers/resource.controller';

const router = Router();

// Allow Knowledge Base Manager in Admin Dashboard to fetch resources
router.get('/', ResourceController.getResources);

export default router;
