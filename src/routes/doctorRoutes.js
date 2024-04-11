import { Router } from 'express';
const router = Router();
import { getAllSpecialties, getDoctorsBySpecialty, getAllDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor } from '../controllers/doctorController.js';
import authenticateToken from '../middleware/authenticateToken.js';
import authorizeRole from '../middleware/authorizeRole.js';

router.get('/specialty', authenticateToken, getAllSpecialties);
router.get('/specialty/:specialty', authenticateToken, getDoctorsBySpecialty);
router.get('/', authenticateToken, getAllDoctors);
router.get('/:id', authenticateToken, getDoctorById);
router.post('/', authenticateToken, authorizeRole('admin'), createDoctor);
router.put('/:id', authenticateToken, authorizeRole('admin'), updateDoctor);
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteDoctor);

export default router;
