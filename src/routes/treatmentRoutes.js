// src/routes/treatmentRoutes.js

import { Router } from 'express';
const router = Router();
import { getTreatmentsByPatientId, getTreatmentById, createTreatment, updateTreatment, deleteTreatment } from '../controllers/treatmentController.js';
import authenticateToken from '../middleware/authenticateToken.js';
import authorizeRole from '../middleware/authorizeRole.js';

router.get('/patient/:patientId', authenticateToken, authorizeRole('doctor'), getTreatmentsByPatientId);
router.get('/:id', authenticateToken, authorizeRole('doctor'),getTreatmentById);
router.post('/',authenticateToken, authorizeRole('doctor'), createTreatment);
router.put('/:id',authenticateToken, authorizeRole('doctor'), updateTreatment);
router.delete('/:id',authenticateToken, authorizeRole('doctor'), deleteTreatment);

export default router;
