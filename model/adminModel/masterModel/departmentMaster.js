const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/connectDB');

const DeparmentMaster = sequelize.define('departmentmaster', {

  id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dptname: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true
  },
  isactive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = DeparmentMaster;