const { DataTypes } = require("sequelize");
const sequelize = require("../../../db/connectDB");

const FormulaAudit = sequelize.define(
  "formula_audit",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    formula_key: DataTypes.STRING,

    old_logic: DataTypes.TEXT,
    new_logic: DataTypes.TEXT,

    old_version: DataTypes.STRING,
    new_version: DataTypes.STRING,

    changed_by: DataTypes.STRING,
    change_reason: DataTypes.TEXT,

    changed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "formula_audits",
  }
);

module.exports = FormulaAudit;
