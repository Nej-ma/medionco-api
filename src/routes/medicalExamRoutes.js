// src/routes/medicalExamRoutes.js

import { Router } from 'express';
const router = Router();
import { getAllMedicalExams, getMedicalExamById, createMedicalExam, updateMedicalExam, deleteMedicalExam } from '../controllers/medicalExamController.js';
import authenticateToken from '../middleware/authenticateToken.js';
import authorizeRole from '../middleware/authorizeRole.js';


router.get('/', authenticateToken, authorizeRole('doctor'),getAllMedicalExams);
router.get('/:id', authenticateToken, authorizeRole('doctor'),getMedicalExamById);
router.post('/', authenticateToken, authorizeRole('doctor'),createMedicalExam);
router.put('/:id', authenticateToken, authorizeRole('doctor'),updateMedicalExam);
router.delete('/:id', authenticateToken, authorizeRole('doctor'), deleteMedicalExam);

export default router;
