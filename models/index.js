const User = require("./user-model");
const Role = require("./role-model");
const UserRoleMapping = require("./user-role-mapping");
const Product = require("./product-model");
const Sales = require("./sale-model");
const Category = require("./category-model");
const Company = require("./company-model");
const sequelize = require("../config/db-connection");

const ConnectToDatabase = async () => [
  await sequelize.authenticate(),
  await sequelize.sync({ alert: true }),
];

module.exports = {
  User,
  Role,
  UserRoleMapping,
  Product,
  Sales,
  Category,
  Company,
  ConnectToDatabase,
};
