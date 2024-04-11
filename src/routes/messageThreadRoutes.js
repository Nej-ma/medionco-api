import { Router } from 'express';
import { getAllMessageThreads , findOrCreateThread, getMessageThreadById, createMessageThread, deleteMessageThread } from '../controllers/messageThreadController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = Router();

router.get('/', authenticateToken, getAllMessageThreads);
router.get('/:id', authenticateToken, getMessageThreadById);
router.post('/', authenticateToken, createMessageThread);
router.delete('/:id', authenticateToken, deleteMessageThread);
router.get('/findOrCreate/getId/:receiverId', authenticateToken, findOrCreateThread);
export default router;
