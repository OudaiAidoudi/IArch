const axios = require('axios');
const https = require("https");
const httpsAgent = new https.Agent({rejectUnauthorized: false});

const {openCRXConfig} = require('../../environments/apiEnvironment');
// OpenCRX request data
const baseUrl = openCRXConfig.baseUrl;
const credentials = openCRXConfig.credentials;

const config = {
    headers: {
        'Accept': 'application/json'
    },
    httpsAgent: httpsAgent,
    auth: credentials,
};


/**
 * retrieves accounts from openCRX
 */
exports.getAllAccounts = async () => {
    const contacts = await axios.get(
        `${baseUrl}/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account`,
        config
    );
    const accounts = contacts.data.objects;

    var salesMenArray = [],
        customersArray = []

    accounts.map((value) => {
        if (value['@type'].endsWith('LegalEntity')) {
            const {
                fullName,
                accountRating,
                accessLevelBrowse,
                accountState
            } = value;

            customersArray.push({
                accountType: value['@type'].split('account1.')[1],
                accountUID: value['@href'].split('account/')[1],
                fullName,
                accountRating,
                accessLevelBrowse,
                accountState
            });
        }
        if (value['jobTitle'] && value['jobTitle'] === 'Senior Salesman') {
            const {
                firstName,
                lastName,
                governmentId
            } = value;

            salesMenArray.push({
                accountType: value['@type'].split('account1.')[1],
                accountUID: value['@href'].split('account/')[1],
                firstName,
                lastName,
                governmentId
            });
        }
    });
    return [customersArray,salesMenArray]
}

/**
 * retrieves an account from openCRX by uid
 */
exports.getAccountByUID = async (uid) => {
    const contact = await axios.get(
        `${baseUrl}/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/${uid}`,
        config
    );

    const account = contact.data;

    return {
        accountType: account['@type'].split('account1.')[1],
        accountUID: account['@href'].split('account/')[1],
        //name: account['name'],
        fullName: account['fullName'],
        accountRating: account['accountRating'],
        accountState: account['accountState']
    }
}

/**
 * retrieves products from openCRX
 */
exports.getAllProducts = async () => {
    const response = await axios.get(
        `${baseUrl}/org.opencrx.kernel.product1/provider/CRX/segment/Standard/product`,
        config
    );

    const products = response.data.objects;

    var productsArray = [];

    products.map((value) => {
        const {
            productNumber,
            name,
            description
        } = value;

        productsArray.push({
            productType: value['@type'].split('product1.')[1],
            productUID: value['@href'].split('product/')[1],
            productNumber,
            name,
            description
        });
    });

    return productsArray;
}

/**
 * retrieves a product by
 */
exports.getProductByUID = async (uid) => {
    const response = await axios.get(
        `${baseUrl}/org.opencrx.kernel.product1/provider/CRX/segment/Standard/product/${uid}`,
        config
    );

    const product = response.data;

    const {
        productNumber,
        name,
        description
    } = product;

    return {
        productType: product['@type'].split('product1.')[1],
        productUID: product['@href'].split('product/.')[1],
        productNumber,
        name,
        description
    }
}


/**
 * retrieves salesOrders from OpenCRX
 */
exports.getAllSalesOrders = async () => {
    const response = await axios.get(
        `${baseUrl}/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder`,
        config
    );

    const salesOrders = response.data.objects;

    var salesOrdersArray = [];

    salesOrders.map((value) => {
        const {
            priority,
            contractNumber,
            totalTaxAmount,
            totalBaseAmount,
            totalAmountIncludingTax
        } = value;

        salesOrdersArray.push({
            contractType: value['@type'].split('contract1.')[1],
            salesOrderUID: value['@href'].split('salesOrder/')[1],
            customerUID: value['customer']['@href'].split('account/')[1],
            salesRep: value['salesRep']['@href'].split('account/')[1],
            createdAt: value['createdAt'].slice(0, 4),
            priority,
            contractNumber,
            totalTaxAmount,
            totalBaseAmount,
            totalAmountIncludingTax,
        })

    });
    return salesOrdersArray;
}

/**
 * retrieves a salesOrder from openCRX
 */
exports.getSalesOrderByUID = async (uid) => {
    const response = await axios.get(
        `${baseUrl}/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder/${uid}`,
        config
    );

    const salesOrder = response.data;

    const {
        priority,
        contractNumber,
        totalTaxAmount,
        totalBaseAmount,
        totalAmountIncludingTax
    } = salesOrder;

    return {
        contractType: salesOrder['@type'].split('contract1.')[1],
        salesOrderUID: salesOrder['@href'].split('salesOrder/')[1],
        customerUID: salesOrder['customer']['@href'].split('account/')[1],
        salesRep: salesOrder['salesRep']['@href'].split('account/')[1],
        createdAt: salesOrder['createdAt'].slice(0, 4),
        priority,
        contractNumber,
        totalTaxAmount,
        totalBaseAmount,
        totalAmountIncludingTax
    }

}

/**
 * Get all SalesOrders from a specific salesman
 * @param {*} uid salesman UID
 * @returns {Promise<Array<SalesOrder>>} Array of SalesOrders
 */
exports.getSalesOrdersBySalesRepUID = async (uid) => {
    const orders = await this.getAllSalesOrders();

    return orders.filter(order => order.salesRep == uid)
}

/**
 * retrieves positions from OpenCRX
 */
exports.getAllPositionsByUID = async (uid) => {
    const response = await axios.get(
        `${baseUrl}/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder/${uid}/position`,
        config
    );

    const positions = response.data.objects;

    var positionsArray = [];

    positions.map((value) => {
        const {
            quantity,
            pricePerUnit,
            amount,

        } = value;

        positionsArray.push({
            contractType: value['@type'].split('contract1.')[1],
            positionUID: value['identity'].split('position/')[1],
            productUID: value['product']['@href'].split('product/')[1],
            quantity,
            pricePerUnit,
            amount,
        });
    });

    return positionsArray;
}