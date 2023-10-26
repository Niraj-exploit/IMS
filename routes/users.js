var express = require("express");
var router = express.Router();
require("dotenv").config();

const roleAuthentication = require("../middlewares/role-auth-middleware");
const {
  userRegister,
  userLogin,
  getAllUser,
  getUserInfo,
  assignUserRole,
  deleteUser,
  updateUser,
  updateUserWithRoles,
} = require("../controller/users");

router.post("/register", userRegister);

router.post("/login", userLogin);

router.get("/all-user", roleAuthentication(["ADMIN"]), getAllUser);

router.get("/userInfo/:id", roleAuthentication(["ADMIN"]), getUserInfo);

// router.post("/user-role-assign", roleAuthentication(["ADMIN"]), assignUserRole);

router.delete("/delete-user/:id", roleAuthentication(["ADMIN"]), deleteUser);

// router.put('/update-user/:id', roleAuthentication(['ADMIN']), updateUser)
router.put(
  "/update-user/:id",
  roleAuthentication(["ADMIN"]),
  updateUserWithRoles
);
//Postman req
/*

{
  "email": "admin@gmail.com",
  "password": "admin",
  "roleIds": [1,2,3]
} */
module.exports = router;
