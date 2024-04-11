import medicalExamDAO from '../DAO/medicalExamDAO.js';

// src/controllers/medicalExamController.js


export const getAllMedicalExams = async (req, res, next) => {
    try {
        const exams = await medicalExamDAO.findAll();
        res.json(exams);
    } catch (error) {
        next(error);
    }
};

export const getMedicalExamById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const exam = await medicalExamDAO.findById(id);
        if (exam) {
            res.json(exam);
        } else {
            res.status(404).send('Medical Exam not found');
        }
    } catch (error) {
        next(error);
    }
};

export const createMedicalExam = async (req, res, next) => {
    try {
        const newExam = await medicalExamDAO.create(req.body);
        res.status(201).json(newExam);
    } catch (error) {
        next(error);
    }
};

export const updateMedicalExam = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedExam = await medicalExamDAO.update(id, req.body);
        if (updatedExam) {
            res.json(updatedExam);
        } else {
            res.status(404).send('Medical Exam not found');
        }
    } catch (error) {
        next(error);
    }
};

export const deleteMedicalExam = async (req, res, next) => {
    try {
        const id = req.params.id;
        const success = await medicalExamDAO.softDelete(id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).send('Medical Exam not found');
        }
    } catch (error) {
        next(error);
    }
};

export const restoreMedicalExam = async (req, res, next) => {
    try {
        const id = req.params.id;
        const success = await medicalExamDAO.restore(id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).send('Medical Exam not found');
        }
    } catch (error) {
        next(error);
    }
};
