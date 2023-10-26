const { DataTypes } = require("sequelize");
const sequelize = require("../config/db-connection");

const Company = sequelize.define("companies", {
  cid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  contact: {
    type: DataTypes.INTEGER, // Change data type to INTEGER
  },
});

module.exports = Company;
