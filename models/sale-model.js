const { DataTypes } = require("sequelize");
const sequelize = require("../config/db-connection");
const Product = require("./product-model"); // Import the Product model

const Sale = sequelize.define("sales", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product, 
      key: "id",  
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  detail: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  bname: {
    type: DataTypes.STRING,
  },
  bemail: {
    type: DataTypes.STRING,
  },
  bcontact: {
    type: DataTypes.STRING,
  },
  baddress: {
    type: DataTypes.STRING,
  }
});

module.exports = Sale;
