class medicalExam {
    constructor(id, type, data, results, doctorNotes, DoctorID, PatientID, deletedAt) {
        this.id = id;
        this.type = type;
        this.data = data;
        this.results = results;
        this.doctorNotes = doctorNotes;
        this.DoctorID = DoctorID;
        this.PatientID = PatientID;
        this.deletedAt = deletedAt;
    }
}

export default medicalExam;