

// src/models/Motorcycle.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Motorcycle = sequelize.define('Motorcycle', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cc: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Motorcycle;
