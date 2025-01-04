/**
 * this model specifies the format to exchange bonus-salaries with the frontend
 * and store it in mongoDB
 * @param {number} year
 * @param {number} value
 * @param {string} remark
 * @param {string} verified
 * @param {number} salesManID
 */
class Bonus {
    constructor(year, value, remark, verified, salesManID) {
        this.year = year;
        this.value = value;
        this.remark = remark;
        this.verified = verified;
        this.salesManID = parseInt(salesManID);
    }
}

module.exports = Bonus;