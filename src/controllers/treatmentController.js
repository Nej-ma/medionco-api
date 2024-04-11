import treatmentDAO from '../DAO/treatmentDAO.js';

// src/controllers/treatmentController.js


export const getTreatmentsByPatientId = async (req, res, next) => {
    try {
        console.log('getTreatmentsByPatientId - Params:', req.params); // Debugging statement
        const patientId = req.params.patientId;
        const treatments = await treatmentDAO.findAllByPatientId(patientId);
        console.log('getTreatmentsByPatientId - Result:', treatments); // Debugging statement
        res.json(treatments);
    } catch (error) {
        next(error);
    }
};

export const getTreatmentById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const treatment = await treatmentDAO.findById(id);
        if (treatment) {
            res.json(treatment);
        } else {
            res.status(404).send('Treatment not found');
        }
    } catch (error) {
        next(error);
    }
};

export const createTreatment = async (req, res, next) => {
    try {
        const newTreatment = await treatmentDAO.create(req.body);
        res.status(201).json(newTreatment);
    } catch (error) {
        next(error);
    }
};

export const updateTreatment = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedTreatment = await treatmentDAO.update(id, req.body);
        if (updatedTreatment) {
            res.json(updatedTreatment);
        } else {
            res.status(404).send('Treatment not found');
        }
    } catch (error) {
        next(error);
    }
};

export const deleteTreatment = async (req, res, next) => {
    try {
        const id = req.params.id;
        const success = await treatmentDAO.softDelete(id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).send('Treatment not found');
        }
    } catch (error) {
        next(error);
    }
};

export const restoreTreatment = async (req, res, next) => {
    try {
        const id = req.params.id;
        const success = await treatmentDAO.restore(id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).send('Treatment not found');
        }
    } catch (error) {
        next(error);
    }
};
