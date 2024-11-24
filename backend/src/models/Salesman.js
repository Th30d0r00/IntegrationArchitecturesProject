/**
 * this model specifies the format to exchange salesman data with the frontend and store it in mongoDB
 * @param (string) sid
 * @param {string} firstname
 * @param {string} lastname
 */
class Salesman{
    constructor(sid, firstname, lastname) {
        this.sid = sid;
        this.firstname = firstname;
        this.lastname = lastname;
    }
}

module.exports = Salesman;