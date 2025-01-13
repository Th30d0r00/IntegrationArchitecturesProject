/**
 * this model specifies the format to exchange salesman data with the frontend and store it in mongoDB
 * @param (string) sid
 * @param {string} firstname
 * @param {string} lastname
 */
class Salesman{
    constructor(code ,sid, firstname, lastname, jobTitle, department, supervisor) {
        this.code = code;
        this.sid = sid;
        this.firstname = firstname;
        this.lastname = lastname;
        this.jobTitle = jobTitle;
        this.department = department;
        this.supervisor = supervisor;

    }
}

module.exports = Salesman;