class prescirption{
    constructor(id, treatmentid, medication, dosage, frequency, deleted_at){
        this.id = id;
        this.treatmentid = treatmentid;
        this.medication = medication;
        this.dosage = dosage;
        this.frequency = frequency;
        this.deleted_at = deleted_at;
    }

}

export default prescirption;