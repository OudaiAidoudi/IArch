
const axios = require('axios');
const https = require('https');
const qs = require("querystring");
const httpsAgent = new https.Agent({rejectUnauthorized: false});

// OrangeHRM HTTP Request Header definition
const {orangeHRMConfig} = require('../../environments/apiEnvironment');
const baseUrl = orangeHRMConfig.baseUrl;

const body = qs.stringify({
    client_id: 'api_oauth_id',
    client_secret: 'oauth_secret',
    grant_type: 'password',
    username: orangeHRMConfig.username,
    password: orangeHRMConfig.password
});

const config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
    },
    httpsAgent: httpsAgent,
};

async function generateToken() {
    const response = await axios.post(
        `${baseUrl}/oauth/issueToken`,
        body,
        config
    );

    const accessToken = response.data['access_token'];
    return {
        accessToken: accessToken,
        expires_at: new Date().getTime() + 3600 * 60
    }
}

var issueToken = {}

async function checkToken(issueToken) {
    return issueToken && (issueToken.expires_at - new Date().getTime() > 0) ? issueToken : await generateToken()
}

/**
 * retrieves employees from orangeHRM of sales department (unit --> 2 for Sales)
 */
exports.getAllEmployees = async () => {
    const currentToken = await checkToken(issueToken);
    const {accessToken, expires_at} = currentToken;

    issueToken.accessToken = accessToken;
    issueToken.expires_at = expires_at;

    config.headers['Authorization'] = `Bearer ${accessToken}`;
    const employees = await axios.get(`${baseUrl}/api/v1/employee/search?unit=2`, config);

    return employees.data.data;
}

/**
 * retrieves an employee by employeeId from orangeHRM
 */
exports.getEmployeeByID = async (employeeId) => {
    const currentToken = await checkToken(issueToken);
    const {accessToken, expires_at} = currentToken;

    issueToken.accessToken = accessToken;
    issueToken.expires_at = expires_at;

    config.headers['Authorization'] = `Bearer ${accessToken}`;

    const employeeById = await axios.get(`${baseUrl}/api/v1/employee/${employeeId}`, config);

    return employeeById.data.data;
}

/**
 * retrieves bonusSalary of an employee
 */
exports.getBonusSalariesByEmployee = async (employeeId) => {
    const currentToken = await checkToken(issueToken);
    const {accessToken, expires_at} = currentToken;

    issueToken.accessToken = accessToken;
    issueToken.expires_at = expires_at;

    config.headers['Authorization'] = `Bearer ${accessToken}`;

    const bonusSalariesByEmployee = await axios.get(`${baseUrl}/api/v1/employee/${employeeId}/bonussalary`, config);
    return bonusSalariesByEmployee.data.data;
}

/**
 * insert/add a new bonus in orangeHRM
 */
exports.add = async (bonus) => {
    const currentToken = await checkToken(issueToken);
    const {accessToken, expires_at} = currentToken;

    issueToken.accessToken = accessToken;
    issueToken.expires_at = expires_at;

    config.headers['Authorization'] = `Bearer ${accessToken}`;

    await axios.post(
        `${baseUrl}/api/v1/employee/${bonus.salesManID}/bonussalary`,
        {year: bonus.year, value: bonus.value},
        config
    );
}




