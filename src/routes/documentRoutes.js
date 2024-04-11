import { Router } from 'express';
const router = Router();
import { getAllDocuments, getDocumentById, createDocument, updateDocument, deleteDocument } from '../controllers/documentController.js';
import authenticateToken from '../middleware/authenticateToken.js';
import authorizeRole from '../middleware/authorizeRole.js';

router.get('/', authenticateToken, authorizeRole('doctor'),getAllDocuments);
router.get('/:id',authenticateToken, authorizeRole('doctor'), getDocumentById);
router.post('/', authenticateToken, authorizeRole('doctor'),createDocument);
router.put('/:id',authenticateToken, authorizeRole('doctor'), updateDocument);
router.delete('/:id',authenticateToken, authorizeRole('doctor'), deleteDocument);

export default router;
