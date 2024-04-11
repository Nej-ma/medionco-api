-- migrations/002-seed-data.sql

-- Insert into Users
INSERT INTO Users (Username, Password, Role) VALUES ('admin', 'A', 'admin');

-- Insert into Doctors
INSERT INTO Doctors (Name, FirstName, Specialty, Contact, UserID) VALUES ('Smith', 'John', 'Cardiology', '1234567890', 1);

-- Insert into Patients
INSERT INTO Patients (Name, FirstName, DateOfBirth, Gender, Address, SocialSecurityNumber, MedicalHistory, DoctorID) VALUES ('Doe', 'Jane', '1980-01-01', 'Female', '123 Main St', '123-45-6789', 'No known medical history', 1);

-- Insert into MedicalRecords
INSERT INTO MedicalRecords (PatientID, VisitHistory, MedicalNotes, Allergies, PreexistingConditions) VALUES (1, 'First visit', 'Patient in good health', 'None', 'None');

-- Insert into Treatments
INSERT INTO Treatments (RecordID, Description, StartDate, EndDate, Dosage, PatientID) VALUES (1, 'Vitamin D supplement', '2022-01-01', '2022-12-31', '1000 IU daily', 1);

-- Insert into Prescriptions
INSERT INTO Prescriptions (TreatmentID, Medication, Dosage, Frequency) VALUES (1, 'Vitamin D', '1000 IU', 'Daily');

-- Insert into MedicalExams
INSERT INTO MedicalExams (Type, Date, Results, DoctorNotes, DoctorID, PatientID) VALUES ('Physical', '2022-01-01', 'Normal', 'Patient in good health', 1, 1);

-- Insert into Appointments
INSERT INTO Appointments (PatientID, DoctorID, Date, Time, Purpose) VALUES (1, 1, '2022-01-01', '09:00:00', 'Annual checkup');

-- Insert into MessageThreads
INSERT INTO MessageThreads (Participant1, Participant2) VALUES (1, 1);

-- Insert into Messages
INSERT INTO Messages (ThreadID, SenderID, Content, SendDate) VALUES (1, 1, 'Test message', '2022-01-01 09:00:00');

-- Insert into Documents
INSERT INTO Documents (PatientID, Type, Date, Content) VALUES (1, 'Test document', '2022-01-01', 'Test content');
