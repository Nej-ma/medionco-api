// app.js

import express from 'express';
import pkg from 'body-parser';
const { json } = pkg;

// Import routes
import patientRoutes from './routes/patientRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import medicalRecordRoutes from './routes/medicalRecordRoutes.js';
import treatmentRoutes from './routes/treatmentRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import medicalExamRoutes from './routes/medicalExamRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import messageThreadRoutes from './routes/messageThreadRoutes.js';
import errorHandler from './middleware/errorHandler.js';
const app = express();
const PORT = process.env.PORT || 3000   ;

// Middleware
app.use(json()); // Parses JSON request body

// CORS Middleware (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Use Routes
app.use('/patients', patientRoutes);
app.use('/doctors', doctorRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/medical-records', medicalRecordRoutes);
app.use('/treatments', treatmentRoutes);
app.use('/prescriptions', prescriptionRoutes);
app.use('/medical-exams', medicalExamRoutes);
app.use('/messages', messageRoutes);
app.use('/documents', documentRoutes);
app.use('/users', userRoutes);
app.use('/message-threads', messageThreadRoutes);

// Error handling middleware
app.use(errorHandler);


if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
export default app;
