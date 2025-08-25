const { DataTypes } = require("sequelize");
const sequelize = require("../../../db/connectDB");
const Hospital = require("../../adminModel/masterModel/hospitalMaster");
const Nodal = require("../../adminModel/masterModel/nodalMaster");
const Doctor = require("../../adminModel/masterModel/doctorRegistration");
const Technician = require("../../adminModel/masterModel/technicianMaster");
const Reception = require("../../adminModel/masterModel/receptionMaster");
const Phlebotomist = require("../../adminModel/masterModel/phlebotomistMaster");

const User = sequelize.define(
  "user",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    role: {
      type: DataTypes.ENUM(
        "admin",
        "reception",
        "doctor",
        "technician",
        "phlebotomist"
      ),
      allowNull: false,
    },
    module: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    isactive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    // Renamed to snake_case
    hospital_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Hospital,
        key: "id",
      },
      onDelete: "SET NULL",
    },
    // Renamed to snake_case
    nodal_id: {
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
    technician_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Technician,
        key: "id",
      },
      onDelete: "SET NULL",
    },
    reception_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Reception,
        key: "id",
      },
      onDelete: "SET NULL",
    },
    phlebotomist_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Phlebotomist,
        key: "id",
      },
      onDelete: "SET NULL",
    },
  },
  {
    timestamps: false,
    tableName: "users",
  }
);

module.exports = User;
