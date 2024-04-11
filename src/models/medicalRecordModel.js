class medicalRecord{
    constructor(id, patientid, visithistory, medicalnotes, allergies, preexistingconditions, deletedAt){
        this.id = id;
        this.patientid = patientid;
        this.visithistory = visithistory;
        this.medicalnotes = medicalnotes;
        this.allergies = allergies;
        this.preexistingconditions = preexistingconditions;
        this.deletedAt = deletedAt;
    }

}

export default medicalRecord;