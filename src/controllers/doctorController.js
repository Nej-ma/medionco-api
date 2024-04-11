import doctorDAO from '../DAO/doctorDAO.js';
import userDAO from '../DAO/userDAO.js';
import bcrypt from 'bcrypt';

// src/controllers/doctorController.js


export const getAllDoctors = async (req, res, next) => {
    try {
        const doctors = await doctorDAO.findAll();
        res.json(doctors);
    } catch (error) {
        next(error);
    }
};

export const getDoctorById = async (req, res, next) => {
    console.log("Doctor ID:", req.params.id); // Add this line
    try {
        const id = req.params.id;
        const doctor = await doctorDAO.findById(id);
        console.log("Doctor found:", doctor); // Add this line
        if (doctor) {
            res.json(doctor);
        } else {
            res.status(404).send('Doctor not found');
        }
    } catch (error) {
        console.error("Error fetching doctor by ID:", error);
        next(error);
    }
};

//getAllSpecialties
export const getAllSpecialties = async (req, res, next) => {
    try {
        const specialties = await doctorDAO.getAllSpecialties();
        res.json(specialties);
    } catch (error) {
        next(error);
    }
};

//getDoctorsBySpecialty
export const getDoctorsBySpecialty = async (req, res, next) => {
    try {
        const specialty = req.params.specialty;
        const doctors = await doctorDAO.findBySpecialty(specialty);
        res.json(doctors);
    } catch (error) {
        next(error);
    }
};

export const createDoctor = async (req, res, next) => {
    try {
        // Correct username generation to use `firstname`
        let username = req.body.firstname.toLowerCase() + '.' + req.body.name.toLowerCase();
        const baseUsername = username;
        let userExists = await userDAO.findByUsername(username);
        let attempt = 0;

        // Check for existing username and adjust if necessary
        while (userExists) {
            attempt++;
            username = `${baseUsername}${attempt}`;
            userExists = await userDAO.findByUsername(username);
        }

        // Generate a unique username and default password
        const defaultPassword = username + Math.floor(Math.random() * 900 + 100);
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // Create user with role 'doctor'
        const user = await userDAO.create({
            username: username,
            password: hashedPassword,
            role: 'doctor'
        });

        // Adjusted to match your corrected table schema and column names
        const newDoctorData = {
            name: req.body.name,
            firstname: req.body.firstname, // Ensure this matches the column name in your table
            specialty: req.body.specialty,
            contact: req.body.contact,
            userid: user.id // Ensure this is correctly passed to match the foreign key column
        };

        const newDoctor = await doctorDAO.create(newDoctorData);

        res.status(201).json({ doctor: newDoctor, user: { username, defaultPassword } });
    } catch (error) {
        next(error);
    }
};

export const updateDoctor = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedDoctor = await doctorDAO.update(id, req.body);
        if (updatedDoctor) {
            res.json(updatedDoctor);
        } else {
            res.status(404).send('Doctor not found');
        }
    } catch (error) {
        next(error);
    }
};

export const deleteDoctor = async (req, res, next) => {
    try {
        const id = req.params.id;
        const success = await doctorDAO.softDelete(id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).send('Doctor not found');
        }
    } catch (error) {
        next(error);
    }
};

export const restoreDoctor = async (req, res, next) => {
    try {
        const id = req.params.id;
        const success = await doctorDAO.restore(id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).send('Doctor not found');
        }
    } catch (error) {
        next(error);
    }
};
