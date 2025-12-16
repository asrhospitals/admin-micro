const { DataTypes } = require("sequelize");
const sequelize = require("../../../db/connectDB");

const FormulaMaster = sequelize.define(
  "formula_master",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    formula_key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    formula_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
    },

    formula_expression: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    version: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
  },
  {
    timestamps: true,
    tableName: "formula_masters",
  }
);

module.exports = FormulaMaster;
