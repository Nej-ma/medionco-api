import pool from '../config/db.js';

// src/DAO/userDAO.js


const userDAO = {
    findAll: async () => {
        const { rows } = await pool.query('SELECT * FROM Users WHERE deleted_at IS NULL');
        return rows;
    },
    
    findById: async (id) => {
        const { rows } = await pool.query('SELECT * FROM Users WHERE id = $1', [id]);
        return rows[0];
    },

    create: async (userData) => {
        const { username, password, role } = userData;
        const { rows } = await pool.query(
            'INSERT INTO Users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
            [username, password, role]
        );
        return rows[0];
    },

    update: async (id, userData) => {
        const { username, password, role } = userData;
        const { rows } = await pool.query(
            'UPDATE Users SET username = $1, password = $2, role = $3 WHERE id = $4 RETURNING *',
            [username, password, role, id]
        );
        return rows[0];
    },

    delete: async (id) => {
        const { rowCount } = await pool.query('DELETE FROM Users WHERE id = $1', [id]);
        return rowCount > 0;
    },
    findByUsername: async (username) => {
        const { rows } = await pool.query('SELECT * FROM Users WHERE username = $1', [username]);
        return rows[0];
    },
    softDelete: async (id) => {
        await pool.query('UPDATE Users SET deleted_at = NOW() WHERE id = $1', [id]);
    },
    
    restore: async (id) => {
        await pool.query('UPDATE Users SET deleted_at = NULL WHERE id = $1', [id]);
    },
    updatePassword: async (id, newPassword) => {
        const result = await pool.query('UPDATE Users SET password = $1 WHERE id = $2 RETURNING *', [newPassword, id]);
        return result.rows[0];
    },
    
    
    markPasswordAsChanged: async (id) => {
        const result = await pool.query('UPDATE Users SET password_changed = TRUE WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    },
    
    
};

export default userDAO;
