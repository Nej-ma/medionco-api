// src/models/patientModel.js

class Patient {
    constructor(id, name, firstName, dateOfBirth, gender, address, socialSecurityNumber, medicalHistory, deleted_at, doctorid) {
        this.id = id;
        this.name = name; 
        this.firstName = firstName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.address = address;
        this.socialSecurityNumber = socialSecurityNumber; //le numéro de sécurité sociale qui est formé de 13 chiffres : le sexe (1 chiffre), l'année de naissance (2 chiffres), le mois de naissance (2 chiffres) et le lieu de naissance (5 chiffres) + 3 chiffres pour le numéro d'ordre de l'acte de naissance (aléatoire)
                                                        // exemple :
                                                        // homme né le 05/07/2003 à Paris : 1 03 07 75056 013
                                                        // femme née le 12/12/1999 à Marseille : 2 99 12 13200 012


        this.medicalHistory = medicalHistory; // antécédents médicaux du patient (maladies, opérations, allergies, traitements en cours, etc.) 
        this.deleted_at = deleted_at; 
        this.doctorid = doctorid;

    }



}

export default Patient;