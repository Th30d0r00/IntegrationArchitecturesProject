/**
 * this model specifies the format to exchange userdata with the frontend and store it in mongoDB
 * @param {string} username
 * @param {string} firstname
 * @param {string} lastname
 * @param {string} email
 * @param {string} password
 * @param {boolean} isAdmin
 */
class User{
    constructor(username, sid, firstname, lastname, email, password, isAdmin, role) {
        this._id = undefined;
        this.username = username;
        this.sid = sid;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.isAdmin = isAdmin;
        this.role = role;
    }
}

module.exports = User;