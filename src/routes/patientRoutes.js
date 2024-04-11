// src/routes/patientRoutes.js

import { Router } from 'express';
const router = Router();
import { searchPatients, getAgenda, getAllPatients, getPatientById, getMedicalHistoryByPatientId, getPatientsByDoctorId, getPatientsBySocialSecurityNumber, createPatient, updatePatient, deletePatient } from '../controllers/patientController.js';
import authenticateToken from '../middleware/authenticateToken.js';
import authorizeRole from '../middleware/authorizeRole.js';

router.get('/search', authenticateToken, authorizeRole('doctor'), searchPatients);
router.get('/agenda', authenticateToken, authorizeRole('doctor'), getAgenda);
router.get('/', authenticateToken, authorizeRole('doctor'),getAllPatients);
router.get('/:id',authenticateToken, authorizeRole('doctor'), getPatientById);
router.get('/:id/medical-history',authenticateToken, authorizeRole('doctor'), getMedicalHistoryByPatientId);
router.get('/:id/patients-by-doctor',authenticateToken, authorizeRole('doctor'), getPatientsByDoctorId);
router.get('/:ins', authenticateToken, authorizeRole('doctor'), getPatientsBySocialSecurityNumber);
router.post('/', authenticateToken, authorizeRole('admin'),createPatient);
router.put('/:id',authenticateToken, authorizeRole('doctor'), updatePatient);
router.delete('/:id',authenticateToken, authorizeRole('admin'), deletePatient);

export default router;
