// src/models/doctorModel.js

export default class Doctor {
    constructor(id, name, firstName, specialty, contact, deleted_at, userID) {
        this.id = id;
        this.name = name;
        this.firstName = firstName;
        this.specialty = specialty;
        this.contact = contact;
        this.deleted_at = deleted_at;
        this.userID = userID;
    }
}
