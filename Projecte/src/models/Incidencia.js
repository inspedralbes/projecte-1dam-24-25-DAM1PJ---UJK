const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Incidencia = sequelize.define('Incidencia', {
  id_incidencia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_tipus: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_departament: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  descripcio: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  datetime_creada: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  estat: {
    type: DataTypes.ENUM('En procès', 'Tancada', 'Oberta'),
    allowNull: false,
  },
  prioritat: {
    type: DataTypes.ENUM('Baixa', 'Mitjana', 'Alta', 'Critica'),
    allowNull: false,
  },
}, {
  tableName: 'Incidencia',
  timestamps: false,
});

module.exports = Incidencia;

