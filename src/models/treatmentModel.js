class treatment{
    constructor(id, recordid, description, startdate, enddate, dosage, deleted_at){
        this.id = id;
        this.recordid = recordid;
        this.description = description;
        this.startdate = startdate;
        this.enddate = enddate;
        this.dosage = dosage;
        this.deleted_at = deleted_at;
    }
}

export default treatment;