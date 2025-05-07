// src/models/Incidencia.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Incidencia = sequelize.define('Incidencia', {
  id_incidencia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_usuari: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_tipus: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  descripcio: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  datetime_creada: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  ubicacio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prioritat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Incidencia;
