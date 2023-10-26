var express = require("express");
const roleAuthentication = require("../middlewares/role-auth-middleware");
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  deleteCategoryById,
  updateCategoryById,
} = require("../controller/category-controller");
var router = express.Router();

router.get(
  "/viewAll",
  roleAuthentication(["ADMIN", "EDITOR","USER"]),
  getAllCategories
);
router.get(
  "/view/:id",
  roleAuthentication(["ADMIN", "EDITOR"]),
  getCategoryById
);
router.post("/create", roleAuthentication(["ADMIN", "EDITOR"]), createCategory);
router.delete(
  "/delete/:id",
  roleAuthentication(["ADMIN", "EDITOR"]),
  deleteCategoryById
);
router.put(
  "/update/:id",
  roleAuthentication(["ADMIN", "EDITOR"]),
  updateCategoryById
);

module.exports = router;