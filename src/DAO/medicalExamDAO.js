import pool from '../config/db.js';

// src/DAO/medicalExamDAO.js


const medicalExamDAO = {
    findAll: async () => {
        const { rows } = await pool.query('SELECT * FROM MedicalExams WHERE deleted_at IS NULL');
        return rows;
    },

    findById: async (id) => {
        const { rows } = await pool.query('SELECT * FROM MedicalExams WHERE id = $1', [id]);
        return rows[0];
    },

    create: async (examData) => {
        const { type, date, results, doctorNotes, doctorId, patientId } = examData;
        const { rows } = await pool.query(
            'INSERT INTO MedicalExams (type, date, results, doctor_notes, doctorid, patient_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [type, date, results, doctorNotes, doctorId, patientId]
        );
        return rows[0];
    },

    update: async (id, examData) => {
        const { type, date, results, doctorNotes, doctorId, patientId } = examData;
        const { rows } = await pool.query(
            'UPDATE MedicalExams SET type = $1, date = $2, results = $3, doctor_notes = $4, doctorid = $5, patient_id = $6 WHERE id = $7 RETURNING *',
            [type, date, results, doctorNotes, doctorId, patientId, id]
        );
        return rows[0];
    },

    delete: async (id) => {
        const { rowCount } = await pool.query('DELETE FROM MedicalExams WHERE id = $1', [id]);
        return rowCount > 0;
    },
    softDelete: async (id) => {
        await pool.query('UPDATE MedicalExams SET deleted_at = NOW() WHERE id = $1', [id]);
    },
    restore: async (id) => {
        await pool.query('UPDATE MedicalExams SET deleted_at = NULL WHERE id = $1', [id]);
    },
};

export default medicalExamDAO;
