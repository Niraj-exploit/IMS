var express = require("express");
const roleAuthentication = require("../middlewares/role-auth-middleware");
const {
  createCompany,
  getCompanyInfo,
  updateCompanyById,
} = require("../controller/company-controller");
var router = express.Router();

router.post("/create", roleAuthentication(["ADMIN"]), createCompany);
router.post("/update/:id", roleAuthentication(["ADMIN"]), updateCompanyById);
router.get("/get", getCompanyInfo);

module.exports = router;
