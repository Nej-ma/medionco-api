// src/controllers/patientController.js

import patientDAO from '../DAO/patientDAO.js';

const { findAll, findAgenda, searchPatients: searchPatientsDAO, findById, findMedicalHistoryByPatientId, findPatientsByDoctorId, findBySocialSecurityNumber, create, update, softDelete, restore } = patientDAO;
export async function getAllPatients(req, res, next) {
    try {
        const patients = await findAll();
        res.json(patients);
    } catch (error) {
        next(error);
    }
}
    ////getAgenda with doctorId and date like so : /patients/agenda?doctorId=1&date=&starttime=&endtime=
export async function getAgenda(req, res, next) {
    try {
        const doctorId = req.query.doctorId;
        const date = req.query.date;
        const starttime = req.query.starttime;
        const endtime = req.query.endtime;
        const patients = await findAgenda(doctorId, date, starttime, endtime);
        res.json(patients);
    } catch (error) {
        next(error);
    }
}
    
export async function searchPatients(req, res, next) {
    try {
        const { id, firstname, name } = req.query; // Make sure these are correctly extracted
        console.log('Search Patients - Query:', req.query); // Debugging statement
        const patients = await searchPatientsDAO({ id, firstname, name });
        console.log('Search Patients - Result:', patients); // Debugging statement
        res.json(patients);
    } catch (error) {
        console.error('Search Patients - Error:', error); // Debugging statement
        next(error);
    }
}

export async function getPatientById(req, res, next) {
    try {
        const id = req.params.id;
        const patient = await findById(id);
        if (patient) {
            res.json(patient);
        } else {
            res.status(404).send('Patient not found');
        }
    } catch (error) {
        next(error);
    }
}

export async function getMedicalHistoryByPatientId(req, res, next) {
    try {
        const id = req.params.id;
        const medicalHistory = await findMedicalHistoryByPatientId(id);
        if (medicalHistory) {
            res.json(medicalHistory);
        } else {
            res.status(404).send('Medical history not found');
        }
    } catch (error) {
        next(error);
    }
}

export async function getPatientsByDoctorId(req, res, next) {
    try {
        const id = req.params.id;
        const patients = await findPatientsByDoctorId(id);
        res.json(patients);
    } catch (error) {
        next(error);
    }
}

export async function getPatientsBySocialSecurityNumber(req, res, next) {
    try {
        const ins = req.params.ins;
        const patients = await findBySocialSecurityNumber(ins);
        res.json(patients);
    } catch (error) {
        next(error);
    }
}


export async function createPatient(req, res, next) {
    try {
        const newPatient = await create(req.body);
        res.status(201).json(newPatient);
    } catch (error) {
        next(error);
    }
}

export async function updatePatient(req, res, next) {
    try {
        const id = req.params.id;
        const updatedPatient = await update(id, req.body);
        if (updatedPatient) {
            res.json(updatedPatient);
        } else {
            res.status(404).send('Patient not found');
        }
    } catch (error) {
        next(error);
    }
}

export async function deletePatient(req, res, next) {
    try {
        const id = req.params.id;
        const success = await softDelete(id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).send('Patient not found');
        }
    } catch (error) {
        next(error);
    }
}

export async function restorePatient(req, res, next) {
    try {
        const id = req.params.id;
        const success = await restore(id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).send('Patient not found');
        }
    } catch (error) {
        next(error);
    }
}
