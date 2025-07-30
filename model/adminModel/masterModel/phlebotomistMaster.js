const { DataTypes } = require("sequelize");
const sequalize = require("../../../db/connectDB");

const Phlebotomist = sequalize.define("phlebotomist", {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  phleboname: {
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
  

  dob: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  contactno: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nodal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hospital: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isactive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
},{timestamps:false});

module.exports = Phlebotomist;
