import pool from '../config/db.js';


export default {
    findAll: async () => {
        const { rows } = await pool.query('SELECT * FROM Doctors WHERE deleted_at IS NULL');
        return rows;
    },
    getAllSpecialties: async () => {
        const { rows } = await pool.query('SELECT DISTINCT specialty FROM Doctors WHERE deleted_at IS NULL');
        //only return the value of the specialty not the whole row with the column name "specialty"
        return rows.map(row => row.specialty);
    },
    findBySpecialty: async (specialty) => {
        const { rows } = await pool.query('SELECT * FROM Doctors WHERE specialty = $1 AND deleted_at IS NULL', [specialty]);
        console.log("rows speciality : ", rows)
        return rows.map(row => row);
    },
    findById: async (id) => {
        const { rows } = await pool.query('SELECT * FROM Doctors WHERE id = $1', [id]);
        console.log("rows id : ", rows)
        return rows[0];
    },
    findByUserId: async (userid) => {
        const { rows } = await pool.query('SELECT * FROM Doctors WHERE userid = $1', [userid]);
        return rows[0];
    },
    create: async (doctorData) => {
        const { name, firstname, specialty, contact, userid } = doctorData;
        const { rows } = await pool.query(
            'INSERT INTO Doctors (name, firstname, specialty, contact, userid) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, firstname, specialty, contact, userid]
        );
        return rows[0];
    },
  

    update: async (id, doctorData) => {
        const { name, firstname, specialty, contact, userid } = doctorData;
        const { rows } = await pool.query(
            'UPDATE Doctors SET name = $1, firstname = $2, specialty = $3, contact = $4, userid = $5 WHERE id = $6 RETURNING *',
            [name, firstname, specialty, contact, userid, id]
        );
        return rows[0];
    },

    delete: async (id) => {
        const { rowCount } = await pool.query('DELETE FROM Doctors WHERE id = $1', [id]);
        return rowCount > 0;
    },
    softDelete: async (id) => {
        await pool.query('UPDATE Doctors SET deleted_at = NOW() WHERE id = $1', [id]);
    },
    restaure: async (id) => {
        await pool.query('UPDATE Doctors SET deleted_at = NULL WHERE id = $1', [id]);
    },
};
