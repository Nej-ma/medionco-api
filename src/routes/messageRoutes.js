import { Router } from 'express';
import { getMessagesByThreadId, getMessageById, createMessage, deleteMessage } from '../controllers/messageController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = Router();

router.get('/thread/:threadId', authenticateToken, getMessagesByThreadId);
router.get('/:id', authenticateToken, getMessageById);
router.post('/', authenticateToken, createMessage);
router.delete('/:id', authenticateToken, deleteMessage);

export default router;
