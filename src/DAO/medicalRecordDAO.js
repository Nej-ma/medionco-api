import pool from '../config/db.js';

// src/DAO/medicalRecordDAO.js


const medicalRecordDAO = {
    findAll: async () => {
        const { rows } = await pool.query('SELECT * FROM MedicalRecords WHERE deleted_at IS NULL');
        return rows;
    },

    findByPatientId: async (patientId) => {
        const { rows } = await pool.query('SELECT * FROM MedicalRecords WHERE patientid = $1', [patientId]);
        return rows;
    },

    create: async (recordData) => {
        const { patientId, visitHistory, medicalNotes, allergies, preexistingConditions } = recordData;
        const { rows } = await pool.query(
            'INSERT INTO MedicalRecords (patientid, visit_history, medical_notes, allergies, preexisting_conditions) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [patientId, visitHistory, medicalNotes, allergies, preexistingConditions]
        );
        return rows[0];
    },

    update: async (id, recordData) => {
        const { visitHistory, medicalNotes, allergies, preexistingConditions } = recordData;
        const { rows } = await pool.query(
            'UPDATE MedicalRecords SET visit_history = $1, medical_notes = $2, allergies = $3, preexisting_conditions = $4 WHERE id = $5 RETURNING *',
            [visitHistory, medicalNotes, allergies, preexistingConditions, id]
        );
        return rows[0];
    },

    delete: async (id) => {
        const { rowCount } = await pool.query('DELETE FROM MedicalRecords WHERE id = $1', [id]);
        return rowCount > 0;
    },
    softDelete: async (id) => {
        await pool.query('UPDATE MedicalRecords SET deleted_at = NOW() WHERE id = $1', [id]);
    },
    
    restore: async (id) => {
        await pool.query('UPDATE MedicalRecords SET deleted_at = NULL WHERE id = $1', [id]);
    },
};

export default medicalRecordDAO;
