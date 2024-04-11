// src/routes/prescriptionRoutes.js

import { Router } from 'express';
const router = Router();
import { getPrescriptionsByTreatmentId, getPrescriptionById, createPrescription, updatePrescription, deletePrescription } from '../controllers/prescriptionController.js';
import authenticateToken from '../middleware/authenticateToken.js';
import authorizeRole from '../middleware/authorizeRole.js';


router.get('/treatment/:treatmentId', authenticateToken, authorizeRole('doctor'), getPrescriptionsByTreatmentId);
router.get('/:id', authenticateToken, authorizeRole('doctor'),getPrescriptionById);
router.post('/', authenticateToken, authorizeRole('doctor'), createPrescription);
router.put('/:id',authenticateToken, authorizeRole('doctor'), updatePrescription);
router.delete('/:id',authenticateToken, authorizeRole('doctor'), deletePrescription);

export default router;
