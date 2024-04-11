// src/config/db.js

import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs'; // Import the filesystem module

dotenv.config();

console.log("DB_PASSWORD from environment variables:", process.env.DB_PASSWORD);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database_url: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    }
    }
});


export default pool;
