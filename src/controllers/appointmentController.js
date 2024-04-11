import appointmentDAO from '../DAO/appointmentDAO.js';

// src/controllers/appointmentController.js


export const getAllAppointments = async (req, res, next) => {
    try {
        const appointments = await appointmentDAO.findAll();
        res.json(appointments);
    } catch (error) {
        next(handleError(error));
    }
};

export const getNextAppointmentByDoctorId = async (req, res, next) => {
    try {
        const doctorId = req.params.id;
        const appointments = await appointmentDAO.findNextByDoctorId(doctorId);
        res.json(appointments);
    } catch (error) {
        next(handleError(error));
    }
};

export const getAllAppointmentsByDoctorId = async (req, res, next) => {
    try {
        const doctorId = req.params.id;
        const appointments = await appointmentDAO.findAllByDoctorId(doctorId);
        res.json(appointments);
    } catch (error) {
        next(handleError(error));
    }
};

export const getAllAppointmentsByPatientId = async (req, res, next) => {
    try {
        const patientId = req.params.id;
        const appointments = await appointmentDAO.findAllByPatientId(patientId);
        res.json(appointments);
    } catch (error) {
        next(handleError(error));
    }
};

export const getAppointmentById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const appointment = await appointmentDAO.findById(id);
        if (appointment) {
            res.json(appointment);
        } else {
            res.status(404).send('Appointment not found');
        }
    } catch (error) {
        next(handleError(error));
    }
};

export const createAppointment = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newAppointment = await appointmentDAO.create(req.body);
        res.status(201).json(newAppointment);
    } catch (error) {
        next(handleError(error));
    }
};

export const updateAppointment = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedAppointment = await appointmentDAO.update(id, req.body);
        if (updatedAppointment) {
            res.json(updatedAppointment);
        } else {
            res.status(404).send('Appointment not found');
        }
    } catch (error) {
        next(handleError(error));
    }
};

export const deleteAppointment = async (req, res, next) => {
    try {
        const id = req.params.id;
        const success = await appointmentDAO.softDelete(id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).send('Appointment not found');
        }
    } catch (error) {
        next(handleError(error));
    }
};

export const restoreAppointment = async (req, res, next) => {
    try {
        const id = req.params.id;
        const success = await appointmentDAO.restore(id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).send('Appointment not found');
        }
    } catch (error) {
        next(handleError(error));
    }
};

function handleError(error) {
    if (error.name === 'ValidationError') {
        return new Error('Validation error: ' + error.message);
    } else if (error.name === 'MongoError' && error.code === 11000) {
        return new Error('Duplicate key error');
    } else {
        return error;
    }
}
