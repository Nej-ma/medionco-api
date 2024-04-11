
// src/models/userModel.js

class User {
    constructor(id, username, password, role, deleted_at, password_changed) {
        this.id = id;
        this.username = username;
        this.password = password; 
        this.role = role;
        this.deleted_at = deleted_at;
        this.password_changed = password_changed; 
    }


}

export default User;