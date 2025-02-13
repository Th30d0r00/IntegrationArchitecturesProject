const express = require("express");
const router = express.Router();
const {
  checkAuthorization,
  checkAuthorizationWithRolesAndSid,
} = require("../middlewares/auth-middleware");

/*
    In this file is the routing for the REST-endpoints under /api managed
 */

const authApi = require("../apis/auth-api"); //api-endpoints are loaded from separate files
router.post("/login", authApi.login); //the function decides which request type should be accepted
router.delete("/login", checkAuthorization(), authApi.logout); //middlewares can be defined in parameters
router.get("/login", authApi.isLoggedIn); //the function, which handles requests is specified as the last parameter

const userApi = require("../apis/user-api");
router.get("/user", checkAuthorization(), userApi.getSelf);

const peopleDemoApi = require("../apis/people-demo-api");
router.get("/people", checkAuthorization(), peopleDemoApi.getPeople);

const salesmenApi = require("../apis/salesmen-api");
router.post(
  "/salesmen",
  checkAuthorizationWithRolesAndSid(["admin"]),
  salesmenApi.createSalesman
);
router.get(
  "/salesmen/:sid",
  checkAuthorizationWithRolesAndSid(
    ["Leader", "admin", "HR", "Sales"],
    "Sales"
  ),
  salesmenApi.getSalesmanBySid
);
router.get(
  "/salesmen",
  checkAuthorizationWithRolesAndSid(["Leader", "admin", "HR"]),
  salesmenApi.getAllSalesmen
);
router.delete(
  "/salesmen/:sid",
  checkAuthorizationWithRolesAndSid(["admin"]),
  salesmenApi.deleteSalesman
);
router.post(
  "/salesmen/:sid/performance",
  checkAuthorizationWithRolesAndSid(["admin", "HR"]),
  salesmenApi.addPerformanceRecord
);
router.put(
  "/salesmen/:sid/performance",
  checkAuthorizationWithRolesAndSid(["admin", "HR"]),
  salesmenApi.updatePerformanceRecord
);
router.get(
  "/salesmen/:sid/performance",
  checkAuthorizationWithRolesAndSid(["Leader", "admin", "HR"]),
  salesmenApi.getPerformanceRecordsBySalesmanId
);
router.get(
  "/salesmen/:sid/performance/approved",
  checkAuthorizationWithRolesAndSid(
    ["Leader", "admin", "HR", "Sales"],
    "Sales"
  ),
  salesmenApi.getApprovedPerformanceRecordsBySalesmanId
);
router.get(
  "/salesmen/:sid/performance/:year",
  checkAuthorizationWithRolesAndSid(
    ["Leader", "admin", "HR", "Sales"],
    "Sales"
  ),
  salesmenApi.getPerformanceRecordByYear
);
router.delete(
  "/salesmen/:sid/performance/:year",
  checkAuthorizationWithRolesAndSid(["admin"]),
  salesmenApi.deletePerformanceRecord
);
router.put(
  "/salesmen/:sid/performance/:year",
  checkAuthorizationWithRolesAndSid(["admin", "Leader", "Sales"], "Sales"),
  salesmenApi.updateApprovalStatusPerformanceRecord
);
router.get(
  "/unapprovedSalesmenRecords",
  checkAuthorizationWithRolesAndSid(["Leader", "admin"]),
  salesmenApi.getSalesmenWithUnapprovedPerformanceRecords
);
router.get(
  "/statistics/bonus-distribution",
  checkAuthorizationWithRolesAndSid(["Leader", "admin"]),
  salesmenApi.getBonusDistribution
);
router.get(
  "/statistics/yearly-bonus",
  checkAuthorizationWithRolesAndSid(["Leader", "admin"]),
  salesmenApi.getYearlyBonusStats
);

const orangeHRMApi = require("../apis/orangeHRM-api");
router.get(
  "/employees",
  checkAuthorizationWithRolesAndSid(["admin"]),
  orangeHRMApi.getAllEmployees
);
router.get(
  "/employees/:sid",
  checkAuthorizationWithRolesAndSid(["admin"]),
  orangeHRMApi.getEmployeeById
);
router.post(
  "/employees/:sid/bonus",
  checkAuthorizationWithRolesAndSid(["Leader", "admin"]),
  orangeHRMApi.addBonus
);
router.get(
  "/employees/:sid/bonus",
  checkAuthorizationWithRolesAndSid(["admin"]),
  orangeHRMApi.getAllBonuses
);

const openCRXApi = require("../apis/openCRX-api");
router.get(
  "/accounts",
  checkAuthorizationWithRolesAndSid(["admin"]),
  openCRXApi.getAccounts
);
router.get(
  "/salesorders",
  checkAuthorizationWithRolesAndSid(["admin"]),
  openCRXApi.getSalesOrdersByUid
);
router.get(
  "/products/:uid",
  checkAuthorizationWithRolesAndSid(["admin"]),
  openCRXApi.getProductBySalesOrderId
);
router.get(
  "/products/:uid/name",
  checkAuthorizationWithRolesAndSid(["admin"]),
  openCRXApi.getProductNameById
);
router.get(
  "/ratings/:uid",
  checkAuthorizationWithRolesAndSid(["admin"]),
  openCRXApi.getRatingsByAccount
);
router.get(
  "/salesorders/:governmentId/:year",
  checkAuthorizationWithRolesAndSid(["admin", "HR"]),
  openCRXApi.getSalesOrdersByAccountAndYear
);
module.exports = router;
