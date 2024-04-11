// src/middleware/errorHandler.js
import { ValidationError } from 'express-validation';

function errorHandler(err, req, res, next) {
    // Detailed error logging
    console.error(`Error: ${err.message}`);
    console.error(`Stack: ${err.stack}`);

    if (err instanceof ValidationError) {
        // Handle express-validation errors that result from request validation
        return res.status(err.statusCode).json(err);
    }

    // PostgreSQL unique violation error
    if (err.code === '23505') {
        return res.status(409).json({
            error: 'A resource with the provided identifier already exists.',
        });
    }

    // Handle foreign key violation in PostgreSQL
    if (err.code === '23503') {
        return res.status(400).json({
            error: 'Invalid reference to a foreign key resource.',
        });
    }

    // Handle not null violation in PostgreSQL
    if (err.code === '23502') {
        return res.status(400).json({
            error: 'A required field is missing.',
        });
    }

    // Fallback for other PostgreSQL errors
    if (err.code && err.code.startsWith('23')) {
        return res.status(400).json({
            error: 'Database error: ' + err.message,
        });
    }

    // Handle custom error messages
    if (err.message) {
        return res.status(400).json({
            error: err.message,
        });
    }

    // Handle other errors
    return res.status(500).json({
        error: 'Internal server error',
    });

}

export default errorHandler;
