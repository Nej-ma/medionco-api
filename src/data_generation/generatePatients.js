import { fakerFR as faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import pkg from 'pg';

const { Pool } = pkg;
dotenv.config();


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});



const generatePatientData = () => {
    const gender = faker.number.int({ min: 1, max: 2 }); // 1: Homme, 2: Femme
    const firstName = faker.person.firstName(gender === 1 ? 'male' : 'female');
    const lastName = faker.person.lastName();
    const dateOfBirth = faker.date.between({ from: '1950-01-01', to: '2010-12-31' });
    const address = faker.location.streetAddress();
    const yearOfBirth = dateOfBirth.getFullYear().toString().slice(-2).padStart(2, '0');
    const monthOfBirth = (dateOfBirth.getMonth() + 1).toString().padStart(2, '0');
    const departmentOfBirth = faker.number.int({ min: 1, max: 95 }).toString().padStart(2, '0');
    const inseeCommuneNumber = faker.number.int({ min: 100, max: 999 }).toString().padStart(3, '0');
    const registrationOrder = faker.number.int({ min: 1, max: 999 }).toString().padStart(3, '0');
    const securityKey = faker.number.int({ min: 1, max: 97 }).toString().padStart(2, '0');
    
    const socialSecurityNumber = `${gender}${yearOfBirth}${monthOfBirth}${departmentOfBirth}${inseeCommuneNumber}${registrationOrder}${securityKey}`;
    
    const medicalHistory = faker.lorem.paragraph();
    const doctorId = faker.helpers.arrayElement([1, 3, 4]);
    return {
        name: lastName,
        firstName: firstName,
        dateOfBirth: dateOfBirth,
        gender: gender === 1 ? 'Homme' : 'Femme',
        address: address,
        socialSecurityNumber: socialSecurityNumber,
        medicalHistory: medicalHistory,
        doctorId: doctorId,
    };
};


const insertPatientAndRelatedData = async (patientData) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Insert patient
        const patientInsertQuery = `INSERT INTO Patients (Name, FirstName, DateOfBirth, Gender, Address, SocialSecurityNumber, MedicalHistory, DoctorID) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING ID`;
        const patientValues = [patientData.name, patientData.firstName, patientData.dateOfBirth, patientData.gender, patientData.address, patientData.socialSecurityNumber, patientData.medicalHistory, patientData.doctorId];
        const patientResult = await client.query(patientInsertQuery, patientValues);
        const patientId = patientResult.rows[0].id;
        console.log(`Inserted patient with ID: ${patientId}`);


        await client.query('COMMIT');


        const verifyPatientExistsQuery = `SELECT * FROM Patients WHERE ID = $1`;
        const verifyResult = await client.query(verifyPatientExistsQuery, [patientId]);
        console.log(`Verification result for patient ID ${patientId}:`, verifyResult.rows);

        await client.query('BEGIN');

        const insertMedicalRecord = async (patientId) => {
            const visitHistory = faker.lorem.sentences();
            const medicalNotes = faker.lorem.paragraph();
            const allergies = faker.lorem.words(3);
            const preexistingConditions = faker.lorem.words(5);
        
            const medicalRecordInsertQuery = `INSERT INTO MedicalRecords (PatientID, VisitHistory, MedicalNotes, Allergies, PreexistingConditions) VALUES ($1, $2, $3, $4, $5) RETURNING ID`;
            const result = await pool.query(medicalRecordInsertQuery, [patientId, visitHistory, medicalNotes, allergies, preexistingConditions]);
            const medicalRecordId = result.rows[0].id;
            return medicalRecordId;
        };

        const insertTreatments = async (patientId, medicalRecordId) => {
            const treatmentDescriptions = ["Chimiothérapie", "Radiologie", "Immunothérapie"];
            const startDate = faker.date.between(new Date(), new Date(2024, 12, 12));
            const endDate = faker.date.future(2, startDate);
            const dosage = faker.number.int({min: 1, max: 3}) + " fois par jour";            
        
            const treatmentInsertQuery = `INSERT INTO Treatments (RecordID, Description, StartDate, EndDate, Dosage, patientid) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ID`;
            const treatmentResult = await pool.query(treatmentInsertQuery, [medicalRecordId, faker.helpers.arrayElement(treatmentDescriptions), startDate, endDate, dosage, patientId]);
            const treatmentId = treatmentResult.rows[0].id;
            return treatmentId;
        };

        const insertPrescriptions = async (treatmentId) => {
            const medications = ["Paracétamol", "Ibuprofène", "Amoxicilline"];
            const dosage = ["500 mg", "200 mg", "1 g"];
            const frequency = ["1 fois par jour", "2 fois par jour", "3 fois par jour"];
        
            for (let i = 0; i < faker.number.int({min: 1, max: 3}); i++) {
                const medication = faker.helpers.arrayElement(medications);
                const prescriptionDosage = faker.helpers.arrayElement(dosage);
                const prescriptionFrequency = faker.helpers.arrayElement(frequency);
        
                const prescriptionInsertQuery = `INSERT INTO Prescriptions (TreatmentID, Medication, Dosage, Frequency) VALUES ($1, $2, $3, $4)`;
                await pool.query(prescriptionInsertQuery, [treatmentId, medication, prescriptionDosage, prescriptionFrequency]);
            }
        };
        

        const insertMedicalExams = async (patientId) => {
            const examTypes = ["Radiographie", "Échographie", "IRM"];
            const examResults = ["Normal", "Anomalie détectée", "À surveiller"];
        
            for (let i = 0; i < faker.number.int({min: 1, max: 3}); i++) {
                const type = faker.helpers.arrayElement(examTypes);
                const date = faker.date.between('2020-01-01', '2024-04-08');
                const results = faker.helpers.arrayElement(examResults);
                const doctorNotes = faker.lorem.sentence();
                const doctorId = faker.helpers.arrayElement([1, 3, 4]); // Utiliser un ID de docteur existant
        
                const medicalExamInsertQuery = `INSERT INTO MedicalExams (Type, Date, Results, DoctorNotes, DoctorID, PatientID) VALUES ($1, $2, $3, $4, $5, $6)`;
                await pool.query(medicalExamInsertQuery, [type, date, results, doctorNotes, doctorId, patientId]);
            }
        };
        
        
        const insertAppointments = async (patientId, doctorId) => {
            // Générer une date de rendez-vous aléatoire entre le 1er avril et le 31 décembre 2024
            const appointmentDate = faker.date.between(new Date(2024, 3, 1), new Date(2024, 12, 31));
            
            // Générer une heure de rendez-vous aléatoire entre 8h00 et 17h00
            const appointmentHour = faker.number.int({ min: 8, max: 17 });
            const appointmentMinute = faker.number.int({ min: 0, max: 59 });
            const appointmentTime = `${appointmentHour.toString().padStart(2, '0')}:${appointmentMinute.toString().padStart(2, '0')}`;
            
            // Définir le motif de rendez-vous aléatoirement
            const purposes = ["Consultation", "Examen de suivi", "Vaccination", "Urgence"];
            const purpose = faker.helpers.arrayElement(purposes);
            
            // Insertion du rendez-vous dans la base de données
            const insertQuery = `INSERT INTO Appointments (PatientID, DoctorID, Date, Time, Purpose) VALUES ($1, $2, $3, $4, $5)`;
            await pool.query(insertQuery, [patientId, doctorId, appointmentDate, appointmentTime, purpose]);
        };
        
        
        
        
        await insertMedicalRecord(patientId);
        const medicalRecordId = await insertMedicalRecord(patientId);
        const treatmentId = await insertTreatments(patientId, medicalRecordId);
        await insertPrescriptions(treatmentId);
        await insertMedicalExams(patientId);
        await insertAppointments(patientId, patientData.doctorId);

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

// Générer et insérer des données pour un nombre spécifique de patients
const generateAndInsertData = async (numberOfPatients) => {
    for (let i = 0; i < numberOfPatients; i++) {
        const patientData = generatePatientData();
        await insertPatientAndRelatedData(patientData);
    }
};

generateAndInsertData(1000) // Générer des données pour 1000 patients
    .then(() => console.log('Data generation completed successfully.'))
    .catch(error => console.error('Data generation failed:', error));
