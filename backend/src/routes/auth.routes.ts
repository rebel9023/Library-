import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authLimiter } from '../middleware/rateLimiter.middleware';
import { verifyJWT, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', authLimiter, AuthController.login);
router.post('/api-key', verifyJWT, requireRole(['admin']), AuthController.generateApiKey);

export default router;
