import pool from '../config/db.js';

// src/DAO/treatmentDAO.js


const treatmentDAO = {
    findAllByPatientId: async (patientId) => {
        const { rows } = await pool.query('SELECT * FROM Treatments WHERE patientid = $1 AND deleted_at IS NULL', [patientId]);
        console.log("rows  treatment patient id: ", rows)
        return rows;
    },

    findById: async (id) => {
        const { rows } = await pool.query('SELECT * FROM Treatments WHERE id = $1', [id]);
        return rows[0];
    },

    create: async (treatmentData) => {
        const { patientId, description, startDate, endDate, dosage } = treatmentData;
        const { rows } = await pool.query(
            'INSERT INTO Treatments (patientid, description, start_date, end_date, dosage) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [patientId, description, startDate, endDate, dosage]
        );
        return rows[0];
    },

    update: async (id, treatmentData) => {
        const { description, startDate, endDate, dosage } = treatmentData;
        const { rows } = await pool.query(
            'UPDATE Treatments SET description = $1, start_date = $2, end_date = $3, dosage = $4 WHERE id = $5 RETURNING *',
            [description, startDate, endDate, dosage, id]
        );
        return rows[0];
    },

    delete: async (id) => {
        const { rowCount } = await pool.query('DELETE FROM Treatments WHERE id = $1', [id]);
        return rowCount > 0;
    },
    softDelete: async (id) => {
        await pool.query('UPDATE Treatments SET deleted_at = NOW() WHERE id = $1', [id]);
    },
    
    restore: async (id) => {
        await pool.query('UPDATE Treatments SET deleted_at = NULL WHERE id = $1', [id]);
    },
};

export default treatmentDAO;
