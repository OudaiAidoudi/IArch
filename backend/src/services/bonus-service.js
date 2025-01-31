const salesmanService = require('./salesman-service')
const {fitsModel} = require('../helper/creation-helper')
const Bonus = require('../models/Bonus')
const {getBySalesmanID} = require("./evaluation-record-service");


/**
 * @typedef {Object} evalRecords Evaluation Records with Bonus
 * @property {string} evalRecords.goalDescription - Name of the Evaluation Goal
 * @property {number} evalRecords.targetValue - Goal Value we want to reach
 * @property {number} evalRecords.actualValue - Goal Value that was actually reached
 * @property {number} evalRecords.bonus - Bonus for this Evaluation
 */
/**
 * @typedef {Object} perfBonus
 * @property {number} total - The total amount of money earned for the performance Evaluation
 * @property {Array<evalRecords>} evalRecords - Array of evaluation Records of the evaluation
 */

/**
 *
 * @param {*} db source database
 * @param {*} salesmanID salesman ID
 * @param {*} year current year
 * @returns { Promise<{total: number, evalRecords: perfBonus}> } Total bonus of all records as well as array of performance records with corresponding bonuses
 */
async function calculateBonusPerformance(db, salesmanID, year) {
    const evalRecords = await getBySalesmanID(db, salesmanID);
    const currentRecords = evalRecords.filter(evaRecord => evaRecord.year === year);
    let totalBonus = 0;

    currentRecords.forEach(record => {
        if (record.actualValue > record.targetValue) {
            record.bonus = 100;
        } else if (record.actualValue === record.targetValue) {
            record.bonus = 50;
        } else {
            record.bonus = 20;
        }
        totalBonus += record.bonus;
    });

    console.log('totalbonus', totalBonus);
    return { total: totalBonus, evalRecords: currentRecords };
}

/**
 * Calculate Bonus for one salesman by ID
 * @param {*} db source database
 * @param {*} salesmanID salesman ID
 * @param {*} year current year
 * @returns {Promise<{total: number, perfBonus: perfBonus}>} bonus
 */
exports.calculateBonusBySalesmanID = async (db, salesmanID, year) => {
    const existingBonus = (await this.getBonusBySalesmanID(db, salesmanID)).filter(bonus => bonus.year == year);

    if (existingBonus.length !== 0) {
        await this.delete(db, existingBonus[0]._id);
    }

    const perfBonus = await calculateBonusPerformance(db, salesmanID, year);

    const totalBonus =  perfBonus.total;

    // Save this bonus to the database
    this.add(db, new Bonus(year, totalBonus, "", 0, salesmanID));

    return {salesManID: salesmanID, totalBonus: totalBonus,  perfBonus: perfBonus};
}

/**
 * Calculate Bonuses for all salesmen
 * @param {*} db source database
 * @param {*} year current year
 */
exports.calculateAllBonus = async (db, year) => {
    let salesmen = await salesmanService.getAll(db);
    const returnArray = [];

    await Promise.all(salesmen.map(async (salesman) => {
        const bonus = await this.calculateBonusBySalesmanID(db, salesman._id, year);
        if (bonus.perfBonus.evalRecords.length > 0) {
            returnArray.push(bonus);
        }
    }));

    return returnArray;
}

/**
 * retrieves bonussalaries from database
 * @param db source database
 * @return {Promise<Bonus>}
 */
exports.getAll = async (db) => {
    return await db.collection('bonus').find({}).toArray(); // use of toArray() is important here
}

/**
 * retrieves a bonus by _id from database
 * @param db source database
 * @param _id
 * @return {Promise<Bonus>}
 */
exports.getBonusById = async (db, _id) => {
    return await db.collection('bonus').findOne({_id: _id});
}

/**
 * retrieves all bonuses of a salesman by its id
 * @param db source database
 * @param salesManID salesman ID
 * @returns {Promise<Bonus>}
 */
exports.getBonusBySalesmanID = async (db, salesManID) => {
    return await db.collection('bonus').find({salesManID: parseInt(salesManID)}).toArray();
}

/**
 * insert a new bonus into database
 * @param db target database
 * @param {Bonus} bonus
 */
exports.add = async (db, bonus) => {
    const existingSalesMan = await salesmanService.getSalesManById(db, bonus.salesManID);
    const existingBonus = (await this.getBonusBySalesmanID(db, bonus.salesManID)).filter(exisBonus => exisBonus.year == bonus.year);

    if (existingBonus.length !== 0){
        throw new Error('Bonus for salesman ' + bonus.salesManID + ' already exists for the year ' + bonus.year + '.');
    }

    await fitsModel(bonus, Bonus)   // Check given Object

    if (!existingSalesMan){
        throw new Error('Salesman with id ' + bonus.salesManID + ' does not exists!');
    }

    return (await db.collection('bonus').insertOne(new Bonus(bonus.year, bonus.value, bonus.remark, bonus.verified, bonus.salesManID))).insertedId;
}

/**
 * update an existing bonus
 * @param db target database
 * @param _id
 * @param bonus
 * @return {Promise<Bonus>} bonus
 */
exports.update = async (db, _id, bonus) => {
    const existingBonusById = await db.collection('bonus').findOne({_id: _id});

    if (!existingBonusById) {
        throw new Error(`Bonus with ID ${bonus._id} doesn't exist!`);
    }

    return await db.collection('bonus').updateOne(
        {
            _id: _id
        },
        {
            $set: {
                year: bonus.year,
                value: bonus.value,
                remark: bonus.remark,
                verified: bonus.verified,
            }
        }
    );
}

/**
 * delete a bonus by _id in database
 * @param db source database
 * @param _id
 * @return {Promise<*>}
 */
exports.delete = async (db, _id) => {
    const existingBonusById = await db.collection('bonus').findOne({_id: _id});

    if (!existingBonusById) {
        throw new Error(`Bonus with ID ${_id} doesn't exist!`);
    }

    return db.collection('bonus').deleteOne({_id: _id});
}

/**
 * delete all bonuses of one salesman
 * @param db source database
 * @param salesManID
 * @return {Promise<void>}
 */
exports.deleteBySalesManID = async (db, salesManID) => {
    const existingSalesMan = await db.collection('salesmen').findOne({_id: parseInt(salesManID)});

    if (!existingSalesMan) {
        throw new Error(`Salesman wit id ${salesManID} doesn't exist!`);
    }

    return db.collection('bonus').deleteMany({salesManID: parseInt(salesManID)});
}