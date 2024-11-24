const express = require('express');
const router = express.Router();
const {checkAuthorization} = require('../middlewares/auth-middleware');

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

const salesmenApi = require('../apis/salesmen-api')
router.post('/salesmen', salesmenApi.createSalesman);
router.get('/salesmen/:sid', salesmenApi.getSalesmanBySid);
router.get('/salesmen', salesmenApi.getAllSalesmen);
router.delete('/salesmen/:sid', salesmenApi.deleteSalesman);
router.post('/salesmen/:sid/performance', salesmenApi.addPerformanceRecord);
router.get('/salesmen/:sid/performance', salesmenApi.getPerformanceRecordsBySalesmanId);
router.get('/salesmen/:sid/performance/:year', salesmenApi.getPerformanceRecordByYear);
router.delete('/salesmen/:sid/performance/:year', salesmenApi.deletePerformanceRecord);


module.exports = router;