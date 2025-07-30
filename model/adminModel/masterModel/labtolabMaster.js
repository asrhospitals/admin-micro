const { DataTypes } = require("sequelize");
const sequalize = require("../../../db/connectDB");

const LabtoLab = sequalize.define("labtolab", {
  id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,    
  },
  labname: {
    type: DataTypes.STRING,
    allowNull: false,
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
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  contactperson: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactno : {
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
});

module.exports=LabtoLab;