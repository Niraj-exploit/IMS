var express = require("express");
var router = express.Router();
require("dotenv").config();

const roleAuthentication = require("../middlewares/role-auth-middleware");
const { sale, getLatestSales, saleCount, getSales, calculateRevenueAndProfit, getHighestSelling,view} = require("../controller/sales-controller");

router.post("/:id", roleAuthentication(["USER"]), sale);
router.get('/latestSales', getLatestSales)
router.get('/view/:id',  view)
router.get('/highestSelling', getHighestSelling)
router.get('/salesCount', saleCount);
router.get('/totalSales', roleAuthentication(['ADMIN']), getSales);
router.get('/salesRevenue',  calculateRevenueAndProfit);
module.exports = router;
