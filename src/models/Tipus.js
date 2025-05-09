const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Incidencia = sequelize.define('Tipus', {
  id_tipus: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'tipus',
  timestamps: false,
});

module.exports = Tipus;