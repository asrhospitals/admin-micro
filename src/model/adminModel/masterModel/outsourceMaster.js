const { DataTypes } = require("sequelize");
const sequelize=require("../../../db/connectDB");
const OutLab = sequelize.define("out_lab", {
  id: {
    type:DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  labname: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  addressline: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  contactperson: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactno: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isactive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  credit_limit:{
    type:DataTypes.INTEGER,
    allowNull:true
  }
});

module.exports=OutLab