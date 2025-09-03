const { DataTypes } = require("sequelize");
const sequelize=require("../../../db/connectDB");


const Mandatory = sequelize.define("inv_mandatory", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  resultname: {
    type: DataTypes.STRING,
  },
  resultvalue: {
    type: DataTypes.STRING,
  },
  resultId: DataTypes.INTEGER,
},{timestamps:false});

module.exports = Mandatory;
