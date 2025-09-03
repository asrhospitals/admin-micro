const { DataTypes } = require("sequelize");
const sequelize = require("../../../db/connectDB");

const InvestigationResult = sequelize.define(
  "inv_result",
  {
    resultname: { type: DataTypes.STRING },
    unit: { type: DataTypes.STRING },
    valueType: { type: DataTypes.STRING },
    formula: { type: DataTypes.STRING },
    order: { type: DataTypes.INTEGER },
    roundOff: { type: DataTypes.INTEGER },
    showTrends: { type: DataTypes.BOOLEAN },
    defaultValue: { type: DataTypes.INTEGER },
    investigationId: { type: DataTypes.INTEGER },
  },
  { timestamps: false }
);

module.exports = InvestigationResult;
