import { Router } from 'express';
const router = Router();
import { getUserInfo, login, createUser, getAllUsers, getUserById, updateUser, deleteUser, changePassword } from '../controllers/userController.js';
import authenticateToken from '../middleware/authenticateToken.js';
import authorizeRole from '../middleware/authorizeRole.js';

//example routes for user : http://localhost:3000/users/login
//all routes are prefixed with /users 
router.get('/me', authenticateToken, getUserInfo);
router.get('/verify-token', authenticateToken, (req, res) => {
    res.status(200).json({ valid: true, userId: req.user.userId, role: req.user.role });
});
router.post('/login', login);

router.post('/', createUser); // Assuming you want to allow users to register themselves
router.get('/', authenticateToken, authorizeRole('admin'), getAllUsers);
router.get('/:id', authenticateToken, authorizeRole('admin', 'doctor'), getUserById); // Assuming doctors can view user details, adjust as necessary
router.put('/:id', authenticateToken, authorizeRole('admin', 'doctor'), updateUser); // Assuming doctors can update user details, adjust as necessary
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteUser); // Only admins can delete users
router.put('/:id/change-password', authenticateToken, changePassword);

export default router;

