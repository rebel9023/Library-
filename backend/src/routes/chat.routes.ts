import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';

const router = Router();

router.post('/', ChatController.handleChat);
router.post('/stream', ChatController.streamChat);
router.get('/history', ChatController.getHistory);

export default router;
