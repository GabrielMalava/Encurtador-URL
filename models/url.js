const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Url = sequelize.define('Url', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  originalUrl: { 
    type: DataTypes.TEXT, 
    allowNull: false
  },
  shortCode: { 
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: false,
    index: true
  },
  clicks: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  }
}, {
  timestamps: true,
  tableName: 'urls'
});

module.exports = Url;