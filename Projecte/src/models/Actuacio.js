const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Actuacio = sequelize.define('Actuacio', {
  id_actuacio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_tecnic: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  finalitza_actuacio: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  data_actuacio: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  descripcio: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  id_incidencia: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'Actuacio',
  timestamps: false,
});

module.exports = Actuacio;