const { DataTypes } = require("sequelize");
const sequelize = require("../../db/connectDB");

const AuditLogs = sequelize.define(
   "AuditLog",   
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    model: {
      type: DataTypes.STRING,
    },
    action: {
      type: DataTypes.STRING,
    },
    change_by: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    old_data: {
      type: DataTypes.JSONB,
    },
    new_data: {
      type: DataTypes.JSONB,
    },
  },
  {
    tableName: "audit_logs",
  }
);
module.exports = AuditLogs;
