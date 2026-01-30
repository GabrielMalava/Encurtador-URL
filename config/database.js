const { Sequelize } = require('sequelize');
const path = require('path');

const storage = process.env.DB_STORAGE || path.join(__dirname, '..', 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});

module.exports = { sequelize };