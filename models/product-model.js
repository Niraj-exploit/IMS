// models/Product.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db-connection");
const Category = require("./category-model"); // Assuming you have the Category model in a separate file

const Product = sequelize.define("products", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
  },
  code: {
    type: DataTypes.STRING,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
  bprice: {
    type: DataTypes.DECIMAL(10, 2),
  },
  sprice: {
    type: DataTypes.DECIMAL(10, 2),
  },
  categoryCode: {
    type: DataTypes.STRING,
  },
  sname: {
    type: DataTypes.STRING,
  },
  semail: {
    type: DataTypes.STRING,
  },
  scontact: {
    type: DataTypes.STRING,
  }
}); 

module.exports = Product;
