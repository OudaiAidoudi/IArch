const express = require('express');
const router = express.Router()
const {checkAuthorization} = require('../middlewares/auth-middleware');
const {Roles, roleAuthentification} = require('../middlewares/role-middleware')

/*
    In this file is the routing for the REST-endpoints under /api managed
 */

const authApi = require('../apis/auth-api'); //api-endpoints are loaded from separate files
router.post('/login', authApi.login); //the function decides which request type should be accepted
router.delete('/login', checkAuthorization(),authApi.logout); //middlewares can be defined in parameters
router.get('/login', authApi.isLoggedIn); //the function, which handles requests is specified as the last parameter

const userApi = require('../apis/user-api');
router.get('/user', checkAuthorization(), userApi.getSelf);

const peopleDemoApi = require('../apis/people-demo-api');
router.get('/people', checkAuthorization(), peopleDemoApi.getPeople);


const salesmenApi = require('../apis/salesman-api');
router.get('/salesmen/read/all', roleAuthentification([Roles.CEO, Roles.HR]), salesmenApi.getSalesmen);
router.get('/salesmen/read/firstname/:firstname', salesmenApi.getSalesManByFirstname);
router.get('/salesmen/read/id/:_id', roleAuthentification([Roles.SALESMAN, Roles.CEO, Roles.HR]), salesmenApi.getSalesManById);
router.post('/salesmen/create', roleAuthentification([Roles.CEO, Roles.HR]), salesmenApi.addSalesman);
router.put('/salesmen/update/:_id', roleAuthentification([Roles.CEO, Roles.HR]), salesmenApi.updateSalesManById);
router.delete('/salesmen/delete/id/:_id', roleAuthentification([Roles.CEO, Roles.HR]), salesmenApi.deleteSalesMan);
router.delete('/salesmen/delete/all',roleAuthentification([Roles.CEO, Roles.HR]),  salesmenApi.deleteAllSalesmen);

const evaRecApi = require('../apis/evaluation-record-api');
router.get('/evaluationRecords/read/all', roleAuthentification([Roles.CEO, Roles.HR]), evaRecApi.getAllEvaluationRecords);
router.get('/evaluationRecords/read/id/:_id', roleAuthentification([Roles.SALESMAN, Roles.CEO, Roles.HR], true), evaRecApi.getEvaluationRecordsById); // Not sure how to deal with this
router.get('/evaluationRecords/read/salesmanId/:salesManID', roleAuthentification([Roles.SALESMAN, Roles.CEO, Roles.HR]), evaRecApi.getEvaluationRecordsOfSalesmanById);
router.get('/goals/read/all', roleAuthentification([Roles.CEO, Roles.HR]),evaRecApi.getGoals);
router.post('/evaluationRecords/create', roleAuthentification([Roles.CEO, Roles.HR]),  evaRecApi.addEvaluationRecord);
router.put('/evaluationRecords/update/id/:_id', roleAuthentification([Roles.CEO, Roles.HR]),  evaRecApi.updateEvaluationRecordById);
router.delete('/evaluationRecords/delete/id/:_id', roleAuthentification([Roles.CEO, Roles.HR]),  evaRecApi.deleteEvaluationRecord);
router.delete('/evaluationRecords/delete/salesmanId/:salesManID', roleAuthentification([Roles.CEO, Roles.HR]),  evaRecApi.deleteAllEvaluationRecordsOfSalesmanById);

const bonusApi = require('../apis/bonus-api');
router.get('/bonuses/read/all', roleAuthentification([Roles.CEO, Roles.HR]),  bonusApi.getBonuses);
router.get('/bonuses/read/id/:_id', roleAuthentification([Roles.SALESMAN, Roles.CEO, Roles.HR], true), bonusApi.getBonusById); // Not sure how to deal with this
router.get('/bonuses/read/salesmanId/:salesManID', roleAuthentification([Roles.SALESMAN, Roles.CEO, Roles.HR]), bonusApi.getBonusesOfSalesmanById);

//From here everything allowed to CEO and HR
router.use(roleAuthentification([Roles.CEO, Roles.HR]));

router.get('/bonuses/calculateBonus/sid/:salesManID/:year', bonusApi.calculateBonus);
router.get('/bonuses/calculateBonus/all/:year', bonusApi.calculateAllBonus);
router.post('/bonuses/create', bonusApi.addBonus);
router.put('/bonuses/update/id/:_id', bonusApi.updateBonusById);
router.delete('/bonuses/delete/id/:_id', bonusApi.deleteBonus);
router.delete('/bonuses/delete/salesmanId/:salesManID', bonusApi.deleteAllBonusesOfSalesmanById);


const orangeHRM = require('../apis/orangehrm-api')

router.get('/employees/read/all', orangeHRM.getEmployees);
router.get('/employees/read/id/:id', orangeHRM.getEmployeeById);
router.get('/employees/read/id/:id/bonussalary', orangeHRM.getBonusSalariesByEmployee)
router.post('/employees/id/:id/bonussalary', orangeHRM.addBonusSalary);



const openCRX = require('../apis/openCRX-api');
router.get('/accounts/read/all', openCRX.getAccounts);
router.get('/accounts/read/uid/:uid', openCRX.getAccountByUID);
router.get('/products/read/all', openCRX.getProducts);
router.get('/products/read/uid/:uid', openCRX.getProductByUID);
router.get('/salesOrders/read/all', openCRX.getSalesOrders);
router.get('/salesOrders/read/uid/:uid', openCRX.getSalesOrderByUID);
router.get('/salesOrders/:uid/positions/read/all', openCRX.getPositions);

module.exports = router;
