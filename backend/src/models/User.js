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
    constructor(_id,username, firstname, lastname, email, password, role,isAdmin) {
        this._id = _id;
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.role = role;
        this.isAdmin = isAdmin;
    }
}

module.exports = User;