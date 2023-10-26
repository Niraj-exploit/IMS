require('dotenv').config();

const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
});


// const sequelize = new Sequelize('your database name', 'your postgres username', 'your postgres password',{
//     host: 'localhost',
//     dialect: 'postgres'
// })

module.exports = sequelize;
