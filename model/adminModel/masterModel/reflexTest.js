const { DataTypes } = require("sequelize");
const sequelize=require("../../../db/connectDB");

const ReflexTest = sequelize.define("inv_reflextest", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  triggerparams: {
    type: DataTypes.STRING,
    allowNull:false
  },
  reflextest: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull:false
  },
  resultId: DataTypes.INTEGER,
},{timestamps:false});

module.exports = ReflexTest;
