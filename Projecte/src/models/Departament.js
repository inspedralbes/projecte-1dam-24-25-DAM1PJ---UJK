const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Departament = sequelize.define('Departament', {
  id_departament: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'Departaments',
  timestamps: false,
});

module.exports = Departament;