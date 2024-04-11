import prescriptionDAO from '../DAO/prescriptionDAO.js';

// src/controllers/prescriptionController.js


export const getPrescriptionsByTreatmentId = async (req, res, next) => {
    try {
        const treatmentId = req.params.treatmentId;
        const prescriptions = await prescriptionDAO.findAllByTreatmentId(treatmentId);
        res.json(prescriptions);
    } catch (error) {
        next(error);
    }
};

export const getPrescriptionById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const prescription = await prescriptionDAO.findById(id);
        if (prescription) {
            res.json(prescription);
        } else {
            res.status(404).send('Prescription not found');
        }
    } catch (error) {
        next(error);
    }
};

export const createPrescription = async (req, res, next) => {
    try {
        const newPrescription = await prescriptionDAO.create(req.body);
        res.status(201).json(newPrescription);
    } catch (error) {
        next(error);
    }
};

export const updatePrescription = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedPrescription = await prescriptionDAO.update(id, req.body);
        if (updatedPrescription) {
            res.json(updatedPrescription);
        } else {
            res.status(404).send('Prescription not found');
        }
    } catch (error) {
        next(error);
    }
};

export const deletePrescription = async (req, res, next) => {
    try {
        const id = req.params.id;
        const success = await prescriptionDAO.softDelete(id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).send('Prescription not found');
        }
    } catch (error) {
        next(error);
    }
};

export const restorePrescription = async (req, res, next) => {
    try {
        const id = req.params.id;
        await prescriptionDAO.restore(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
