/**
 * Check if an object has the same properties as a model
 * @param {*} testObject Object to check properties
 * @param {*} classModel Model with the properties to check for
 * @returns {Promise<Boolean>}
 */
exports.fitsModel = async (testObject, classModel) => {
    const testObjectKeys = Object.keys(testObject);
    const modelKeys = Object.keys(new classModel());
    
    // Can't be equal if not same length
    if (testObjectKeys.length != modelKeys.length) {
        throw new Error('Incorrect body object was provided.');
    }

    // Sort and then convert to String to compare
    if (testObjectKeys.sort().toString() != modelKeys.sort().toString()) {
        throw new Error('Incorrect body object was provided.');
    }
}