// src/routes/medicalRecordRoutes.js

import { Router } from 'express';
const router = Router();
import { getAllMedicalRecords, getMedicalRecordByPatientId, createMedicalRecord, updateMedicalRecord, deleteMedicalRecord } from '../controllers/medicalRecordController.js';
import authenticateToken from '../middleware/authenticateToken.js';
import authorizeRole from '../middleware/authorizeRole.js';

router.get('/', authenticateToken, authorizeRole('doctor'), getAllMedicalRecords);
router.get('/patient/:patientId', authenticateToken, authorizeRole('doctor'),getMedicalRecordByPatientId);
router.post('/', authenticateToken, authorizeRole('doctor'),createMedicalRecord);
router.put('/:id', authenticateToken, authorizeRole('doctor'), updateMedicalRecord);
router.delete('/:id',authenticateToken, authorizeRole('admin'), deleteMedicalRecord);

export default router;
