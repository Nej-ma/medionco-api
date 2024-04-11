import { fakerFR as faker } from '@faker-js/faker';
import pkg from 'pg';
const { Pool } = pkg;



const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const doctorUserIds = [1, 3, 4]; 

const createMessageThreadAndMessages = async () => {
    const client = await pool.connect();
    try {
        for (let i = 0; i < doctorUserIds.length; i++) {
            for (let j = i + 1; j < doctorUserIds.length; j++) {
                // Créer un fil de discussion entre deux docteurs
                const threadInsertQuery = `INSERT INTO MessageThreads (Participant1, Participant2) VALUES ($1, $2) RETURNING ID`;
                const threadResult = await client.query(threadInsertQuery, [doctorUserIds[i], doctorUserIds[j]]);
                const threadId = threadResult.rows[0].id;

                // Générer 5 à 10 messages aléatoires pour ce fil
                const numMessages = faker.datatype.number({ min: 5, max: 10 });
                for (let k = 0; k < numMessages; k++) {
                    const senderId = faker.random.arrayElement([doctorUserIds[i], doctorUserIds[j]]);
                    const content = faker.lorem.sentence();
                    const sendDate = faker.date.past(1);

                    const messageInsertQuery = `INSERT INTO Messages (ThreadID, SenderID, Content, SendDate) VALUES ($1, $2, $3, $4)`;
                    await client.query(messageInsertQuery, [threadId, senderId, content, sendDate]);
                }
            }
        }
    } catch (error) {
        console.error('Failed to generate message threads and messages:', error);
    } finally {
        client.release();
    }
};

createMessageThreadAndMessages().then(() => console.log('Message threads and messages generated successfully.'));
