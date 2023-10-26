const { DataTypes } = require("sequelize");
const sequelize = require("../config/db-connection");

const Role = sequelize.define("roles", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  code: {
    type: DataTypes.STRING,
  },
});

module.exports = Role;
