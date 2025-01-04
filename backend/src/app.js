/*
    This file acts as the entrypoint for node.js
 */

const express = require('express');
const cookieSession = require('cookie-session');

// Implements Swagger UI with swagger jsdoc
const swaggerUi = require('swagger-ui-express');

const options = require('../swagger.json');

const multer = require('multer');
const upload = multer();
const app = express();
const crypto = require('crypto');
const cors = require('cors');

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let environment;
if (process.env.NODE_ENV === 'development') {
    environment = require('../environments/environment.js').default;
} else {
    environment = require('../environments/environment.prod.js').default;
}

app.set('environment', environment);

app.use(express.json()); //adds support for json encoded bodies
app.use(express.urlencoded({extended: true})); //adds support url encoded bodies
app.use(upload.array()); //adds support multipart/form-data bodies

app.use(cookieSession({
    secret: crypto.randomBytes(32).toString('hex'),
    sameSite: false,
    secure: false,
    httpOnly: false
}));

app.use(cors({
    origin: environment.corsOrigins,
    credentials: true
}));

// Swagger-UI
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(options)
);


const apiRouter = require('./routes/api-routes'); //get api-router from routes/api
app.use('/api', apiRouter); //mount api-router at path "/api"
// !!!! attention all middlewares, mounted after the router wont be called for any requests

//preparing database credentials for establishing the connection:
let db_credentials = '';
if (environment.db.username) {
    db_credentials = environment.db.username + ':' + environment.db.password + '@';
}

MongoClient.connect('mongodb://' + db_credentials + environment.db.host + ':' + environment.db.port + '/?authSource=' + environment.db.authSource).then(async dbo => { //connect to MongoDb

    const db = dbo.db(environment.db.name);
    await initDb(db); //run initialization function
    app.set('db', db); //register database in the express app

    app.listen(environment.port, () => { //start webserver, after database-connection was established
        console.log('Webserver started.');
    });
});

async function initDb(db) {
    if (await db.collection('users').count() < 5) { // If test users don't exist create new ones
        if (await db.collection('users').count() > 0) { // If users are missing
            await db.collection('users').drop();
        }

        const userService = require('./services/user-service');
        const User = require("./models/User");

        const adminPassword = environment.defaultAdminPassword;
        await userService.add(db, new User(1, 'admin', '', 'admin', '', adminPassword, '', true));
        await userService.add(db, new User(7, 'CEO', 'Michael', 'Moore', 'Micheal@CEO.com', "CEO123", 'CEO', false));
        await userService.add(db, new User(5, 'HR', 'Chantal', 'Banks', 'chantal@hr.com', "HR123", 'HR', false));
        await userService.add(db, new User(31, 'salesman1', 'Paul', 'Kaye', 'dave@dave.com', "salesman123", 'SALESMAN', false));
        await userService.add(db, new User(9, 'salesman2', 'Mary-Ann', 'Sallinger', 'Mary@example.com', "salesman123", 'SALESMAN', false));

        console.log('created admin user with password: ' + adminPassword);
        console.log('created CEO user with password: ' + "CEO123");
        console.log('created HR user with password: ' + "HR123");
        console.log('created salesman1 user with password: ' + "salesman123");
        console.log('created salesman2 user with password: ' + "salesman123");
    }

    const salesmanService = require('../src/services/salesman-service');
    if (await db.collection('salesmen').count() < 1) {    // Get Salesman from OrangeHRM if local mongoDB is empty
        try {
            console.log("Attempting to fetch Salesman data from OrangeHRM and OpenCRX...");
            await salesmanService.getSalesmenFromAPI(db);
            console.log("Successfully fetched salesman data!")
        } catch (error) {
            console.log("Currently unable to get Salesman from OrangeHRM. Reason: " + error);
        }
    }

    const evalRecordService = require('../src/services/evaluation-record-service');
    if (await db.collection('goals').count() < 1) {
        await evalRecordService.addGoal(db, 'Leadership Competence');
        await evalRecordService.addGoal(db, 'Openness to Employee');
        await evalRecordService.addGoal(db, 'Social Behaviour to Employee');
        await evalRecordService.addGoal(db, 'Attitude towards Client');
        await evalRecordService.addGoal(db, 'Communication Skills');
        await evalRecordService.addGoal(db, 'Integrity to Company');
    }
}

    const userStoriesRouter = require('./routes/userStories');
    app.use('/api', userStoriesRouter); // Mount User Stories router at path "/api"







