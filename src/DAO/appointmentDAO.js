import pool from '../config/db.js';

// src/DAO/appointmentDAO.js


export default {
    findAll: async () => {
        const { rows } = await pool.query('SELECT * FROM Appointments WHERE deleted_at IS NULL');
        return rows;
    },

    findById: async (id) => {
        const { rows } = await pool.query('SELECT * FROM Appointments WHERE id = $1', [id]);
        return rows[0];
    },
    findNextByDoctorId: async (doctorId) => {
        const { rows } = await pool.query(
            `SELECT * FROM Appointments 
             WHERE doctorid = $1 AND deleted_at IS NULL 
             AND (date > CURRENT_DATE OR (date = CURRENT_DATE AND time >= CURRENT_TIME))
             ORDER BY date ASC, time ASC LIMIT 1`,
            [doctorId]
        );
        console.log("rows next appointment : ", rows)
        return rows[0];
    },
    findAllByPatientId: async (patientId) => {
        console.log("patientid : ", patientId)
        const { rows } = await pool.query('SELECT * FROM Appointments WHERE patientid = $1 AND deleted_at IS NULL', [patientId]);
        console.log("rows patientid appointment : ", rows)
        return rows;
    },
    findAllByDoctorId: async (doctorId) => {
        const { rows } = await pool.query('SELECT * FROM Appointments WHERE doctorid = $1 AND deleted_at IS NULL', [doctorId]);
        return rows;
    },
    create: async (appointmentData) => {
        const { patientId, doctorId, date, time, purpose } = appointmentData;
        const { rows } = await pool.query(
            'INSERT INTO Appointments (patientid, doctorid, date, time, purpose) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [patientId, doctorId, date, time, purpose]
        );
        return rows[0];
    },

    update: async (id, appointmentData) => {
        const { patientId, doctorId, date, time, purpose } = appointmentData;
        const { rows } = await pool.query(
            'UPDATE Appointments SET patientid = $1, doctorid = $2, date = $3, time = $4, purpose = $5 WHERE id = $6 RETURNING *',
            [patientId, doctorId, date, time, purpose, id]
        );
        return rows[0];
    },

    delete: async (id) => {
        const { rowCount } = await pool.query('DELETE FROM Appointments WHERE id = $1', [id]);
        return rowCount > 0;
    },
    softDelete: async (id) => {
        await pool.query('UPDATE Appointments SET deleted_at = NOW() WHERE id = $1', [id]);
    },
    restore: async (id) => {
        await pool.query('UPDATE Appointments SET deleted_at = NULL WHERE id = $1', [id]);
    },
};
