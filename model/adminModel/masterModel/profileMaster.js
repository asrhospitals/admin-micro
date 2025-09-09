const { DataTypes } = require("sequelize");
const sequelize = require("../../../db/connectDB");
const Investigation = require("../../adminModel/masterModel/investigation");
const ProfileEntry = require("../../adminModel/masterModel/profileentrymaster");

const Profile = sequelize.define(
  "profile_master",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    profileid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProfileEntry,
        key: "id",
      },
    },
    investigationids: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    isactive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Profile;
