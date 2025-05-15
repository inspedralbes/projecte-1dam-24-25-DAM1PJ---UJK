const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Tecnic = sequelize.define('Tecnic', {
  id_tecnic: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'Tecnic',
  timestamps: false,
});

module.exports = Tecnic;
