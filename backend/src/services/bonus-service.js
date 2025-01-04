const {getBySalesmanID} = require('./evaluation-record-service')
const salesmanService = require('./salesman-service')
const openCRXService = require('./opencrxService')
const {fitsModel} = require('../helper/creation-helper')
const Bonus = require('../models/Bonus')

/**
 * @typedef {Object} evalRecords Evaluation Records with Bonus
 * @property {string} evalRecords.goalDescription - Name of the Evaluation Goal
 * @property {number} evalRecords.targetValue - Goal Value we want to reach
 * @property {number} evalRecords.actualValue - Goal Value that was actually reached
 * @property {number} evalRecords.bonus - Bonus for this Evaluation
 */

/**
 * @typedef {Object} salesOrders Sales order with Bonus
 * @property {string} ClientName name of Client
 * @property {number} ClientRanking ranking of Client
 * @property {Array} ItemsSold List of Items sold
 * @property {string} ItemsSold.ProductName name of product
 * @property {number} ItemsSold.amount amount of product sold
 * @property {number} ItemsSold.bonus bonus of this sell
 */

/**
 * @typedef {Object} orderBonus
 * @property {number} total - The total amount of money earned for the orders
 * @property {Array<salesOrders} orderBonuses - Array of Order Bonuses
 */

/**
 * @typedef {Object} perfBonus
 * @property {number} total - The total amount of money earned for the performance Evaluation
 * @property {Array<evalRecords>} evalRecords - Array of evaluation Records of the evaluation

 */



/**
 * @param {*} db source database
 * @param {*} salesmanID salesman ID
 * @param {*} year current year
 * @returns {Promise<{total: number, orderBonus: orderBonus}>} Total bonus of all sales orders aswell as array of sales orders with corresponding bonuses
 */
async function calculateBonusOrder(db, salesManID, year) {
    const salesman = await salesmanService.getSalesManById(db, salesManID);
    let salesOrders = await openCRXService.getSalesOrdersBySalesRepUID(salesman.uid);
    const orders = [];
    let total = 0;

    // filter to current year and remove empty Sales Orders
    salesOrders = salesOrders.filter(order => order.createdAt == year && parseFloat(order.totalBaseAmount) !== 0);

    // for each order calculate everything (Promise.all allows this to calculate in parallel)
    await Promise.all(salesOrders.map(async order => {
        let finishedOrder = {};
        const customer = await openCRXService.getAccountByUID(order.customerUID);
        // Name of Customer
        finishedOrder.name = customer.fullName;

        // Map Rating to String
        switch(customer.accountRating) {
            case 1: finishedOrder.rating = 'excellent'; break;
            case 2: finishedOrder.rating = 'very good'; break;
            case 3: finishedOrder.rating = 'good'; break;
        };

        // Percentage cut the salesman get from total amount sold
        const bonusPercentage = 10 - (customer.accountRating * 2.5);

        // Get positions
        const positions = await openCRXService.getAllPositionsByUID(order.salesOrderUID);
        const itemsSold = [];

        // Go through all positions
        await Promise.all(positions.map(async position => {
            let item = {};

            item.name = (await openCRXService.getProductByUID(position.productUID)).name;
            item.amount = parseInt(position.quantity);
            item.bonus = (parseFloat(position.amount) / 100) * bonusPercentage;

            itemsSold.push(item);
        }));

        finishedOrder.itemsSold = itemsSold;

        // calculate total Bonus
        total += (parseFloat(order.totalAmountIncludingTax) / 100) * bonusPercentage;

        // push to return array
        orders.push(finishedOrder);
    }));

    return {total: total, salesOrders: orders}
}

/**
 *
 * @param {*} db source database
 * @param {*} salesmanID salesman ID
 * @param {*} year current year
 * @returns { Promise<{total: number, evalRecords: perfBonus}> } Total bonus of all records aswell as array of performance records with corresponding bonuses
 */
async function calculateBonusPerformance(db, salesmanID, year) {
    // Get all records of current year
    const evalRecords = await getBySalesmanID(db, salesmanID);
    const currentRecords = evalRecords.filter(evaRecord => evaRecord.year == year);
    let totalBonus = 0;

    currentRecords.forEach(record => {
        if (record.actualValue > record.targetValue) {
            record.bonus = 100;
        } else if (record.actualValue == record.targetValue) {
            record.bonus = 50;
        } else {
            record.bonus = 20;
        }

        totalBonus += record.bonus;
    });

    return {total: totalBonus, evalRecords: currentRecords};
}

/**
 * Calculate Bonus for one salesman by ID
 * @param {*} db source database
 * @param {*} salesmanID salesman ID
 * @param {*} year current year
 * @returns {Promise<{total: number, orderBonus: orderBonus, perfBonus: perfBonus}>} Total bonus, Sales orders with bonuses and the performance records with bonuses
 */
exports.calculateBonusBySalesmanID = async (db, salesmanID, year) => {
    const existingBonus = (await this.getBonusBySalesmanID(db, salesmanID)).filter(bonus => bonus.year == year);

    if (existingBonus.length !== 0) {
        await this.delete(db, existingBonus[0]._id);
    }

    const orderBonus = await calculateBonusOrder(db, salesmanID, year);
    const perfBonus = await calculateBonusPerformance(db, salesmanID, year);

    const totalBonus = orderBonus.total + perfBonus.total;

    // Save this bonus to the database
    this.add(db, new Bonus(year, totalBonus, "", 0, salesmanID));

    return {salesManID: salesmanID, totalBonus: totalBonus, orderBonus: orderBonus, perfBonus: perfBonus};
}

/**
 * Calculate Bonuses for all salesmen
 * @param {*} db source database
 * @param {*} year current year
 */
exports.calculateAllBonus = async (db, year) => {
    let salesmen = await salesmanService.getAll(db);
    salesmen = salesmen.filter(salesman => salesman.uid !== null && salesman.uid !== undefined)
    const returnArray = [];

    await Promise.all(salesmen.map( async salesman => {
        const bonus = await this.calculateBonusBySalesmanID(db, salesman._id, year);

        returnArray.push(bonus);
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