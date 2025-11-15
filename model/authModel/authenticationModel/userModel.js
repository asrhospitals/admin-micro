const { DataTypes } = require("sequelize");
const sequelize = require("../../../db/connectDB");
const Hospital = require("../../adminModel/masterModel/hospitalMaster");
const Nodal = require("../../adminModel/masterModel/nodalMaster");
const Doctor = require("../../adminModel/masterModel/doctorRegistration");
const RoleType = require("../../adminModel/masterModel/roletypeMaster");

const User = sequelize.define(
  "user",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    wattsapp_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    mobile_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    alternate_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    module: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: RoleType,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    isactive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_by: {
      type: DataTypes.STRING, 
      allowNull: true,
    },
    created_date: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING, 
      allowNull: true,
    },
    certificate:{
      type:DataTypes.STRING
    },
    update_by:{
      type: DataTypes.STRING,
    },
    update_date:{
      type: DataTypes.DATEONLY,
    },
    hospitalid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Hospital,
        key: "id",
      },
      onDelete: "SET NULL",
    },
    nodalid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Nodal,
        key: "id",
      },
      onDelete: "SET NULL",
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Doctor,
        key: "id",
      },
      onDelete: "SET NULL",
    },
    nominee_name:{
      type:DataTypes.STRING
    },
    nominee_contact:{
      type:DataTypes.STRING
    }
  },
  {
    timestamps: true,
    tableName: "users",
  }
);

module.exports = User;