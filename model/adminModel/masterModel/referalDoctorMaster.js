const { DataTypes } = require("sequelize");
const sequalize = require("../../../db/connectDB");

const ReferralDoctor = sequalize.define("ref_doctor", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ref_doc_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address_line: {
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

  qualification: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
  },
  ttm: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hospitalid: {
    type: DataTypes.INTEGER,
    references: {
      model: "hospitals",
      key: "id",
    },
    onDelete: "CASCADE",
    allowNull: false,
  },
  contact_no: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isactive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = ReferralDoctor;
