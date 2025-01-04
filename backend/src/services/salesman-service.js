const Salesman = require('../models/SalesMan');
const {fitsModel} = require('../helper/creation-helper')
const orangeHRMService = require('../services/orangehrmService')
const openCRXService = require('../services/opencrxService');

/**
 * retrieves salesmen from database
 * @param db source database
 * @return {Promise<SalesMan>}
 */
exports.getAll = async (db) => {
    return await db.collection('salesmen').find().toArray(); // use of toArray() is important here.
}

/**
 * retrieves salesmen by firstname from database
 * @param db source database
 * @param firstname
 * @return {Promise<SalesMan>}
 */
exports.getSalesManByFirstname = async (db, firstname) => {
    return await db.collection('salesmen').findOne({firstname: firstname});
}

/**
 * retrieves salesmen by _id from database
 * @param db source database
 * @param _id
 * @return {Promise<SalesMan>}
 */
exports.getSalesManById = async (db, _id) => {
    return await db.collection('salesmen').findOne({_id: parseInt(_id)});
}

/**
 * insert a new salesman into database
 * @param db target database
 * @param {SalesMan} salesman
 */
exports.add = async (db, salesman) => {
    const existingSalesmanId = await db.collection('salesmen').findOne({_id: salesman._id});
    salesman.uid = undefined;

    await fitsModel(salesman, Salesman) // Check given Object
    
    if (existingSalesmanId) {
        throw new Error('Salesman with id ' + salesman._id + ' already exist!');
    }
    
    return (await db.collection('salesmen').insertOne(new Salesman(
        salesman.firstname,
        salesman.middleName,
        salesman.lastname,
        salesman.fullName,
        salesman.unit,
        salesman.jobTitle,
        salesman._id,
        salesman.uid
    ))).insertedId;
}

/**
 * insert a new salesman with a UID into database
 * @param db target database
 * @param {SalesMan} salesman with uid
 */
exports.addWithUID = async (db, salesman) => {
    const existingSalesmanId = await db.collection('salesmen').findOne({_id: salesman._id});

    await fitsModel(salesman, Salesman)
    
    if (existingSalesmanId) {
        throw new Error('Salesman with id ' + salesman._id + ' already exist!');
    }
    
    return (await db.collection('salesmen').insertOne(new Salesman(
        salesman.firstname,
        salesman.middleName,
        salesman.lastname,
        salesman.fullName,
        salesman.unit,
        salesman.jobTitle,
        salesman._id,
        salesman.uid
    ))).insertedId;
}

/**
 * update an existing salesman
 * @param db target database
 * @param _id
 * @param salesman
 * @return {Promise<SalesMan>} salesman
 */
exports.update = async (db, _id, salesman) => {
    const existingSalesmanId = await db.collection('salesmen').findOne({_id: parseInt(_id)});
    
    if (!existingSalesmanId) {
        throw new Error("Salesmen with id " + _id + " doesn't exist!");
    }

    return await db.collection('salesmen').updateOne(
        {
            _id: parseInt(_id)
        },
        { // TODO: provide 3 updates because when updating only firstname here we setting lastname to null!
            $set: {
                firstname: salesman.firstname,
                middleName: salesman.middleName,
                lastname: salesman.lastname,
                fullName: salesman.fullName,
                unit: salesman.unit,
                jobTitle: salesman.jobTitle,
                _id: salesman._id,
                uid: salesman.uid,
            }
        }
    );
}

/**
 * delete a salesman by _id in database
 * @param db source database
 * @param _id
 * @return {Promise<*>}
 */
exports.delete = async (db, _id) => {
    const existingSalesMan = await db.collection('salesmen').findOne({_id: parseInt(_id)});

    if (!existingSalesMan) {
        throw new Error("Salesman with id " + _id + " doesn't exist!")
    }

    return db.collection('salesmen').deleteOne({_id: parseInt(_id)})
}

exports.getSalesmenFromAPI = async (db) => {    
    const orangeHRMEmployees = await orangeHRMService.getAllEmployees();
    // Only get Contacts
    let openCRXAccounts = (await openCRXService.getAllAccounts())[1];
    await Promise.all(orangeHRMEmployees.map(async employee => {
        let hasUID = false;

        if(((await this.getSalesManById(db, employee.employeeId)) !== null)) {
            await this.delete(db, employee.employeeId)
        }
        
        for (let i = 0; i < openCRXAccounts.length; i++) {
            const account = openCRXAccounts[i];

            if (employee.code == account.governmentId) {
                await this.addWithUID(db, new Salesman(
                    employee.firstName,
                    employee.middleName,
                    employee.lastName,
                    employee.fullName,
                    employee.unit,
                    employee.jobTitle,
                    employee.employeeId,
                    account.accountUID
                ));
                hasUID = true;
                // remove this account from check list
                openCRXAccounts.splice(i, 1);
            }
        }

        if (!hasUID) {
            await this.add(db, new Salesman(
                employee.firstName,
                employee.middleName,
                employee.lastName,
                employee.fullName,
                employee.unit,
                employee.jobTitle,
                employee.employeeId
            ));
        }
    }));
}

/**
 * delete all salesman in database
 * @param db source database
 * @return {Promise<*>}
 */
exports.deleteAll = async (db) => {
    return await db.collection('salesmen').deleteMany({});
}