const { DataTypes } = require("sequelize");
const sequalize = require("../../../db/connectDB");

const ReferralDoctor = sequalize.define("ref_doctor", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  category: {
    type: DataTypes.ENUM(
      "External Doctor",
      "Hospital",
      "Blood Bank",
      "Diagnostic Center"
    ),
    allowNull: false,
  },
  ref_doc_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact_no: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ref_by: { type: DataTypes.STRING },
  isactive: { type: DataTypes.BOOLEAN },
  incentive_plan: { type: DataTypes.STRING },
  alternate_contact_no: { type: DataTypes.STRING },
  street: { type: DataTypes.STRING },
  company: { type: DataTypes.STRING },
  area: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  state: { type: DataTypes.STRING },
  pincode: { type: DataTypes.INTEGER },
  email: { type: DataTypes.STRING },
  marketing_source: { type: DataTypes.STRING },
  other_agents: { type: DataTypes.STRING },
  hospitalid: {
    type: DataTypes.INTEGER,
    references: {
      model: "hospitals",
      key: "id",
    },
    onDelete: "CASCADE",
    allowNull: false,
  },
  other_details: { type: DataTypes.STRING },
  include_in_referred_by: { type: DataTypes.BOOLEAN },
  is_external: { type: DataTypes.BOOLEAN },
  visit_type: {
    type: DataTypes.ENUM("OP"),
    allowNull: false,
  },
  incentive_plan_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  incentive_amount_type: {
    type: DataTypes.ENUM("Billed Amount", "Collected Amount"),
  },
  consultant_incentive_rate_plan: {
    type: DataTypes.ENUM(
      "20 PERCENTAGE",
      "25 PERCENTAGE",
      "30 PERCENTAGE",
      "40 PERCENTAGE"
    ),
  },
  referral_incentive_rate_plan: {
    type: DataTypes.ENUM(
      "20 PERCENTAGE",
      "25 PERCENTAGE",
      "30 PERCENTAGE",
      "40 PERCENTAGE"
    ),
  },
  pharmacy_incentive_percentage: { type: DataTypes.STRING },
  include_discount: { type: DataTypes.ENUM("Yes", "No") },
  include_full_discount: { type: DataTypes.ENUM("Yes", "No") },
});

module.exports = ReferralDoctor;
