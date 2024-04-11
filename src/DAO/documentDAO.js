import pool from '../config/db.js';

// src/DAO/documentDAO.js


const documentDAO = {
    findAll: async () => {
        const { rows } = await pool.query('SELECT * FROM Documents WHERE deleted_at IS NULL');
        return rows;
    },

    findById: async (id) => {
        const { rows } = await pool.query('SELECT * FROM Documents WHERE id = $1', [id]);
        return rows[0];
    },

    create: async (documentData) => {
        const { patientId, type, date, content } = documentData;
        const { rows } = await pool.query(
            'INSERT INTO Documents (patient_id, type, date, content) VALUES ($1, $2, $3, $4) RETURNING *',
            [patientId, type, date, content]
        );
        return rows[0];
    },

    update: async (id, documentData) => {
        const { patientId, type, date, content } = documentData;
        const { rows } = await pool.query(
            'UPDATE Documents SET patient_id = $1, type = $2, date = $3, content = $4 WHERE id = $5 RETURNING *',
            [patientId, type, date, content, id]
        );
        return rows[0];
    },

    delete: async (id) => {
        const { rowCount } = await pool.query('DELETE FROM Documents WHERE id = $1', [id]);
        return rowCount > 0;
    },
    softDelete: async (id) => {
        await pool.query('UPDATE Documents SET deleted_at = NOW() WHERE id = $1', [id]);
    },
    restore: async (id) => {
        await pool.query('UPDATE Documents SET deleted_at = NULL WHERE id = $1', [id]);
    },
};

export default documentDAO;
