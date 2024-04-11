import pool from '../config/db.js';

// src/DAO/prescriptionDAO.js


const prescriptionDAO = {
    findAllByTreatmentId: async (treatmentId) => {
        const { rows } = await pool.query('SELECT * FROM Prescriptions WHERE treatmentid = $1 AND deleted_at IS NULL', [treatmentId]);
        return rows;
    },

    findById: async (id) => {
        const { rows } = await pool.query('SELECT * FROM Prescriptions WHERE id = $1', [id]);
        return rows[0];
    },

    create: async (prescriptionData) => {
        const { treatmentId, medication, dosage, frequency } = prescriptionData;
        const { rows } = await pool.query(
            'INSERT INTO Prescriptions (treatmentid, medication, dosage, frequency) VALUES ($1, $2, $3, $4) RETURNING *',
            [treatmentId, medication, dosage, frequency]
        );
        return rows[0];
    },

    update: async (id, prescriptionData) => {
        const { medication, dosage, frequency } = prescriptionData;
        const { rows } = await pool.query(
            'UPDATE Prescriptions SET medication = $1, dosage = $2, frequency = $3 WHERE id = $4 RETURNING *',
            [medication, dosage, frequency, id]
        );
        return rows[0];
    },

    delete: async (id) => {
        const { rowCount } = await pool.query('DELETE FROM Prescriptions WHERE id = $1', [id]);
        return rowCount > 0;
    },
    softDelete: async (id) => {
        await pool.query('UPDATE Prescriptions SET deleted_at = NOW() WHERE id = $1', [id]);
    },
    
    restore: async (id) => {
        await pool.query('UPDATE Prescriptions SET deleted_at = NULL WHERE id = $1', [id]);
    },
};

export default prescriptionDAO;
