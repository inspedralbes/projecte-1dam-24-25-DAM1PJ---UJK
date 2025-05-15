const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Usuari = sequelize.define('Usuari', {
  id_usuari: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_departament: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
    password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nom: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM('Alumne/a', 'Professor/a'),
    allowNull: false,
  },
});

module.exports = Usuari;