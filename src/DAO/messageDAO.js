import pool from '../config/db.js';

const messageDAO = {
    findAllByThreadId: async (threadId) => {
        const { rows } = await pool.query(`
            SELECT * FROM Messages 
            WHERE threadid = $1 AND deleted_at IS NULL 
            ORDER BY senddate ASC`, 
            [threadId]);
        return rows;
    },

    findById: async (id) => {
        const { rows } = await pool.query(`
            SELECT * FROM Messages 
            WHERE id = $1`, 
            [id]);
        return rows[0];
    },

    create: async (messageData) => {
        const { threadId, senderId, content } = messageData;
        console.log("threadId, senderId, content : ", threadId, senderId, content)
        const { rows } = await pool.query(`
            INSERT INTO Messages (threadid, senderid, content, senddate) 
            VALUES ($1, $2, $3, NOW()) RETURNING *`, 
            [threadId, senderId, content]);
        return rows[0];
    },

    softDelete: async (id) => {
        await pool.query(`
            UPDATE Messages 
            SET deleted_at = NOW() 
            WHERE id = $1`, 
            [id]);
    },

    restore: async (id) => {
        await pool.query(`
            UPDATE Messages 
            SET deleted_at = NULL 
            WHERE id = $1`, 
            [id]);
    },
};

export default messageDAO;
