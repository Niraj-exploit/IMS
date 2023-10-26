const { DataTypes } = require("sequelize");
const sequelize = require("../config/db-connection");

const Category = sequelize.define("categories", {
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
  volume: {
    type: DataTypes.INTEGER ,
  },
  catNum: {
    type: DataTypes.STRING,
  },
});

module.exports = Category;
