import pool from '../config/db.js';

const messageThreadDAO = {
  // Find all threads for a user
  findAllForUser: async (userId) => {
    const { rows } = await pool.query(`
      SELECT * FROM MessageThreads 
      WHERE (participant1 = $1 OR participant2 = $1) 
      AND deleted_at IS NULL`, 
      [userId]);
    return rows;
  },

  // Find a single thread by ID
  findById: async (id) => {
    const { rows } = await pool.query(`
      SELECT * FROM MessageThreads 
      WHERE id = $1`, 
      [id]);
    return rows[0];
  },

  
  // Create or find existing thread between two participants
  findOrCreate: async (participant1, participant2) => {
    // Assuming participant1 and participant2 are user IDs. If they are doctor IDs, convert them first
    async function getUserIdByDoctorId(doctorId) {
      const result = await pool.query('SELECT userid FROM doctors WHERE id = $1', [doctorId]);
      return result.rows[0]?.userid;
    }

    // Check if participants are doctor IDs and convert them to user IDs if necessary
    const userParticipant1 = participant1;
    const userParticipant2 = await getUserIdByDoctorId(participant2);
    console.log("userParticipant1 findorcreat, userParticipant2: ", userParticipant1, userParticipant2);
    let { rows } = await pool.query(`
      SELECT * FROM MessageThreads 
      WHERE ((participant1 = $1 AND participant2 = $2) OR (participant1 = $2 AND participant2 = $1))
      AND deleted_at IS NULL`,
      [userParticipant1, userParticipant2]);

    if (rows.length > 0) {
      // If thread exists, return it
      return rows[0];
    } else {
      // If not, create a new thread and return it
      ({ rows } = await pool.query(`
        INSERT INTO MessageThreads (participant1, participant2) 
        VALUES ($1, $2) RETURNING *`,
        [userParticipant1, userParticipant2]));
      return rows[0];
    }
  },

  // Soft delete a thread by ID
  softDelete: async (id) => {
    await pool.query(`
      UPDATE MessageThreads 
      SET deleted_at = NOW() 
      WHERE id = $1`, 
      [id]);
  },

  // Restore a soft-deleted thread
  restore: async (id) => {
    await pool.query(`
      UPDATE MessageThreads 
      SET deleted_at = NULL 
      WHERE id = $1`, 
      [id]);
  },
};

export default messageThreadDAO;
