const { DataTypes } = require("sequelize");
const sequalize = require("../../../db/connectDB");


const ProfileEntryMaster = sequalize.define(
  "profile_entry",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    profilename: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    profilecode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    alternativebarcode: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isactive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);



module.exports = ProfileEntryMaster;
