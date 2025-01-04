class SalesMan {
    constructor(
        firstname,
        middleName,
        lastname,
        fullName,
        unit,
        jobTitle,
        _id,
        uid
    ) {
        this.firstname = firstname;
        this.middleName = middleName;
        this.lastname = lastname;
        this.fullName = fullName;
        this.unit = unit;
        this.jobTitle = jobTitle
        this._id = parseInt(_id);
        this.uid = uid;
    }
}

module.exports = SalesMan;