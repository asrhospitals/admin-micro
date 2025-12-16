const { DataTypes } = require("sequelize");
const sequelize = require("../../../db/connectDB");

const ColorMaster = sequelize.define(
  "color",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status_of_color:{
      type:DataTypes.STRING,
      allowNull:false
    },
    colorcode: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},   // e.g., { hex: "#ff0000", rgb: "rgb(255,0,0)", hsl: "hsl(0, 100%, 50%)" }
    },
  },
);

module.exports = ColorMaster;