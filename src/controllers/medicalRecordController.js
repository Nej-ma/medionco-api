import medicalRecordDAO from '../DAO/medicalRecordDAO.js';

// src/controllers/medicalRecordController.js


export const getAllMedicalRecords = async (req, res, next) => {
    try {
        const records = await medicalRecordDAO.findAll();
        res.json(records);
    } catch (error) {
        next(error);
    }
};

export const getMedicalRecordByPatientId = async (req, res, next) => {
    try {
        const patientId = req.params.patientId;
        const record = await medicalRecordDAO.findByPatientId(patientId);
        if (record) {
            res.json(record);
        } else {
            res.status(404).send('Medical Record not found for the given patient ID');
        }
    } catch (error) {
        next(error);
    }
};

export const createMedicalRecord = async (req, res, next) => {
    try {
        const newRecord = await medicalRecordDAO.create(req.body);
        res.status(201).json(newRecord);
    } catch (error) {
        next(error);
    }
};

export const updateMedicalRecord = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedRecord = await medicalRecordDAO.update(id, req.body);
        if (updatedRecord) {
            res.json(updatedRecord);
        } else {
            res.status(404).send('Medical Record not found');
        }
    } catch (error) {
        next(error);
    }
};

export const deleteMedicalRecord = async (req, res, next) => {
    try {
        const id = req.params.id;
        const success = await medicalRecordDAO.softDelete(id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).send('Medical Record not found');
        }
    } catch (error) {
        next(error);
    }
};

export const restoreMedicalRecord = async (req, res, next) => {
    try {
        const id = req.params.id;
        const success = await medicalRecordDAO.restore(id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).send('Medical Record not found');
        }
    }
    catch (error) {
        next(error);
    }
}
