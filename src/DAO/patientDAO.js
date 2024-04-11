import pool from '../config/db.js';

// src/DAO/patientDAO.js


export default {
    findAll: async () => {
        const { rows } = await pool.query('SELECT * FROM Patients WHERE deleted_at IS NULL');
        return rows;
    },
    ////getAgenda with doctorId and date like so : /patients/agenda?doctorId=1&date=&starttime=&endtime=
    //by default the date is the current date
    findAgenda: async (doctorId, date, starttime, endtime) => {
        let query = 'SELECT * FROM patients WHERE id IN (SELECT patientid FROM appointments WHERE doctorid = $1 AND date = $2 AND deleted_at IS NULL AND time >= $3 AND time <= $4)';
        const params = [doctorId, date || new Date().toISOString().split('T')[0], starttime || '00:00:00', endtime || '23:59:59'];
        console.log("findAgenda - Query:", query);
        console.log("findAgenda - Params:", params);
        const { rows } = await pool.query(query, params);
        return rows;
    },
    searchPatients: async ({ id, firstname, name }) => {
        let query = 'SELECT * FROM Patients WHERE deleted_at IS NULL';
        const params = [];

        if (id) {
            query += ` AND id = $${params.length + 1}`;
            params.push(id);
        }
        if (firstname && name) {
            query += ` AND LOWER(firstname) LIKE LOWER($${params.length + 1}) AND LOWER(name) LIKE LOWER($${params.length + 2})`;
            params.push(`%${firstname.trim()}%`);
            params.push(`%${name.trim()}%`);
        }
        if (firstname) {
            query += ` AND LOWER(firstname) LIKE LOWER($${params.length + 1})`;
            params.push(`%${firstname.trim()}%`);
        }
        if (name) {
            query += ` AND LOWER(name) LIKE LOWER($${params.length + 1})`;
            params.push(`%${name.trim()}%`);
        }

        // Debugging outputs
        console.log("Search Patients - Query:", query);
        console.log("Search Patients - Params:", params);

        const { rows } = await pool.query(query, params);
        return rows;
    },

    findById: async (id) => {
        const { rows } = await pool.query('SELECT * FROM Patients WHERE id = $1', [id]);
        return rows[0];
    },
    findBySocialSecurityNumber: async (socialSecurityNumber) => {
        const { rows } = await pool.query('SELECT * FROM Patients WHERE socialsecuritynumber = $1', [socialSecurityNumber]);
        return rows[0];
    },
    findPatientsByDoctorId: async (doctorId) => {
        const { rows } = await pool.query('SELECT * FROM Patients WHERE DoctorID = $1', [doctorId]);
        return rows;
    },
    findMedicalHistoryByPatientId: async (patientId) => {
        const { rows } = await pool.query('SELECT medicalhistory FROM Patients WHERE id = $1', [patientId]);
        return rows[0];
    },

    create: async (patientData) => {
        const { name, firstName, dateOfBirth, gender, address, socialSecurityNumber, medicalHistory, userId } = patientData;
        const { rows } = await pool.query(
            'INSERT INTO Patients (name, first_name, date_of_birth, gender, address, social_security_number, medical_history, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [name, firstName, dateOfBirth, gender, address, socialSecurityNumber, medicalHistory, userId]
        );
        return rows[0];
    },

    update: async (id, patientData) => {
        const { name, firstName, dateOfBirth, gender, address, socialSecurityNumber, medicalHistory, userId } = patientData;
        const { rows } = await pool.query(
            'UPDATE Patients SET name = $1, first_name = $2, date_of_birth = $3, gender = $4, address = $5, social_security_number = $6, medical_history = $7, user_id = $8 WHERE id = $9 RETURNING *',
            [name, firstName, dateOfBirth, gender, address, socialSecurityNumber, medicalHistory, userId, id]
        );
        return rows[0];
    },

    delete: async (id) => {
        const { rowCount } = await pool.query('DELETE FROM Patients WHERE id = $1', [id]);
        return rowCount > 0;
    },
    softDelete: async (id) => {
        await pool.query('UPDATE Patients SET deleted_at = NOW() WHERE id = $1', [id]);
    },

    restore: async (id) => {
        await pool.query('UPDATE Patients SET deleted_at = NULL WHERE id = $1', [id]);
    },
};
