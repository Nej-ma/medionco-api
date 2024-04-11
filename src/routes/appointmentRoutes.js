// src/routes/appointmentRoutes.js

import { Router } from 'express';
const router = Router();
import { getNextAppointmentByDoctorId, getAllAppointmentsByPatientId, getAllAppointmentsByDoctorId, getAllAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment } from '../controllers/appointmentController.js';
import authenticateToken from '../middleware/authenticateToken.js';
import authorizeRole from '../middleware/authorizeRole.js';


router.get('/doctor/next/:id', authenticateToken, getNextAppointmentByDoctorId);
router.get('/:patient/:id',authenticateToken,getAllAppointmentsByPatientId);
router.get('/doctor/:id',authenticateToken,getAllAppointmentsByDoctorId);
router.get('/', authenticateToken,getAllAppointments);
router.get('/:id', authenticateToken, getAppointmentById);
router.post('/', authenticateToken, authorizeRole('doctor'),createAppointment);
router.put('/:id', authenticateToken, authorizeRole('doctor'),updateAppointment);
router.delete('/:id', authenticateToken, authorizeRole('doctor'),deleteAppointment);
export default router;


