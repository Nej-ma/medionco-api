import userDAO from '../DAO/userDAO.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import doctorDAO from '../DAO/doctorDAO.js';

// src/controllers/userController.js


// Login function
export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await userDAO.findByUsername(username);
        if (!user) return res.status(401).send('User not found');

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) return res.status(401).send('Invalid Password');

        // Generate JWT Token
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
        
        if (!user.password_changed) {
            return res.json({
                token: token,
                message: "Please change your password",
                changePassword: true // Indicates that password change is required
            });
        }

        res.json({ token: token, changePassword: false });
    } catch (error) {
        next(error);
    }
};

export const getUserInfo = async (req, res, next) => {
    try {
        console.log('User info:', req.user);
        const userId = req.user.id;
        const userInfo = await userDAO.findById(userId);
        
        if (!userInfo) {
            return res.status(404).send('User not found');
        }

        // If the user is a doctor, fetch additional info
        console.log('User role:', userInfo.role);
        if (userInfo.role === 'doctor') {
            console.log('is doctor', userId);
            const doctorInfo = await doctorDAO.findByUserId(userId);
            console.log('Doctor info:', doctorInfo);
            return res.json({ ...userInfo, ...doctorInfo });
        }

        // For admin or other roles, adjust as needed
        console.log('User info:', userInfo);
        res.json(userInfo);
    } catch (error) {
        next(error);
    }
};


export const changePassword = async (req, res, next) => {
    try {
        console.log('Change password:', req.body);
        
        const userId = parseInt(req.params.id); // Parse to integer for comparison
        const { currentPassword, newPassword } = req.body;
        const authenticatedUser = req.user; // Extracted from JWT token
        console.log('Authenticated user:', authenticatedUser);
        console.log('User ID:', userId);
        // Check permission: only the account owner or an admin can change the password
        if (userId !== authenticatedUser.userId && authenticatedUser.role !== 'admin') {
            return res.status(403).send("You don't have permission to change this user's password.");
        }

        const user = await userDAO.findById(userId);
        if (!user) return res.status(404).send('User not found');

        // For non-admins, verify the current password
        if (authenticatedUser.role !== 'admin') {
            console.log('Current password not admin:', currentPassword);
            const passwordIsValid = await bcrypt.compare(currentPassword, user.password);
            if (!passwordIsValid) {
                return res.status(401).send('Current password is incorrect.');
            }
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 12);
        await userDAO.updatePassword(userId, hashedNewPassword);
        await userDAO.markPasswordAsChanged(userId);

        res.send('Password successfully updated.');
    } catch (error) {
        next(error);
    }
};



export const getAllUsers = async (req, res, next) => {
    try {
        const users = await userDAO.findAll();
        res.json(users);
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await userDAO.findById(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        next(error);
    }
};

export const createUser = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const newUser = await userDAO.create({
            username: req.body.username,
            password: hashedPassword,
            role: req.body.role
        });
        res.status(201).json({ userId: newUser.id, username: newUser.username, role: newUser.role });
    } catch (error) {
        next(error);
    }
};
export const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedUser = await userDAO.update(id, req.body);
        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const success = await userDAO.softDelete(id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        next(error);
    }
};

export const restoreUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        await userDAO.restore(id);
        res.send('User successfully restored.');
    } catch (error) {
        next(error);
    }
};
