const Investigation = require("../adminModel/masterModel/investigation");
const Hospital = require("../adminModel/masterModel/hospitalMaster");
const ProfileEntry = require("../adminModel/masterModel/profileentrymaster");
const Profile = require("../adminModel/masterModel/profileMaster");
const Nodal = require("../adminModel/masterModel/nodalMaster");
const NodalHospital = require("../adminModel/masterModel/attachNodalHospitalMaster");
const InvestigationResult = require("../adminModel/masterModel/investigationResult");
const NormalValue = require("../adminModel/masterModel/normalValue");
const Doctor = require("../adminModel/masterModel/doctorRegistration");
const Technician = require("../adminModel/masterModel/technicianMaster");
const Reception = require("../adminModel/masterModel/receptionMaster");
const Phlebotomist = require("../adminModel/masterModel/phlebotomistMaster");
const User = require("../authModel/authenticationModel/userModel");
const Department = require("../adminModel/masterModel/departmentMaster");
const Subdepartment = require("../adminModel/masterModel/subdptMaster");
const HospitalType = require("../adminModel/masterModel/hospitalTypeMaster");
const Mandatory = require("../adminModel/masterModel/mandatory");
const ReflexTest = require("../adminModel/masterModel/reflexTest");
const Instrument = require("../adminModel/masterModel/instrumentMaster");
const NodalInstrument = require("../adminModel/masterModel/attachNodalInstrumentMaster");

// Associations

// 1. Investigation → InvestigationResults
Investigation.hasMany(InvestigationResult, {
  foreignKey: "investigationId",
  as: "results",
  onDelete: "CASCADE",
});
InvestigationResult.belongsTo(Investigation, {
  foreignKey: "investigationId",
  as: "investigation",
});

// 2. InvestigationResult → NormalValues
InvestigationResult.hasMany(NormalValue, {
  foreignKey: "resultId",
  as: "normalValues",
  onDelete: "CASCADE",
});
NormalValue.belongsTo(InvestigationResult, {
  foreignKey: "resultId",
  as: "result",
});

// 3.InvestigationResult → Mandatory
InvestigationResult.hasMany(Mandatory, {
  foreignKey: "resultId",
  as: "mandatories",
  onDelete: "CASCADE",
});
Mandatory.belongsTo(InvestigationResult, {
  foreignKey: "resultId",
  as: "result",
});

// 4.InvestigationResult → ReflexTest
InvestigationResult.hasMany(ReflexTest, {
  foreignKey: "resultId",
  as: "reflexTests",
  onDelete: "CASCADE",
});
ReflexTest.belongsTo(InvestigationResult, {
  foreignKey: "resultId",
  as: "result",
});

Profile.belongsTo(ProfileEntry, { foreignKey: "profileid" });
ProfileEntry.hasMany(Profile, { foreignKey: "profileid" });

Investigation.belongsTo(Department, { foreignKey: "departmentId" });
Department.hasMany(Investigation, { foreignKey: "departmentId" });

// Nodal - NodalHospital one-to-many
//NodalHospital belongs to Nodal through nodalid
NodalHospital.belongsTo(Nodal, {
  foreignKey: "nodalid", // This should match the column name in NodalHospital
  targetKey: "id", // This is the primary key in Nodal table
  as: "nodal",
});

// NodalHospital belongs to Hospital through hospitalid
NodalHospital.belongsTo(Hospital, {
  foreignKey: "hospitalid", // This should match the column name in NodalHospital
  targetKey: "id", // This is the primary key in Hospital table
  as: "hospital",
});

Doctor.hasOne(User, { foreignKey: "doctor_id" });
User.belongsTo(Doctor, { foreignKey: "doctor_id" });

Technician.hasOne(User, { foreignKey: "technician_id" });
User.belongsTo(Technician, { foreignKey: "technician_id" });

Reception.hasOne(User, { foreignKey: "reception_id" });
User.belongsTo(Reception, { foreignKey: "reception_id" });

Phlebotomist.hasOne(User, { foreignKey: "phlebotomist_id" });
User.belongsTo(Phlebotomist, { foreignKey: "phlebotomist_id" });

// Department has many sub departments
Department.hasMany(Subdepartment, {
  foreignKey: "department_id",
  as: "department",
});
//Subdepartment belongs only departments
Subdepartment.belongsTo(Department, {
  foreignKey: "department_id",
  as: "department",
});

// A HospitalType has many Hospitals
HospitalType.hasMany(Hospital, {
  foreignKey: "hospital_type_id",
  as: "hospitals",
});
// A Hospital belongs to a HospitalType
Hospital.belongsTo(HospitalType, {
  foreignKey: "hospital_type_id",
  as: "hospitalType",
});

// Hospital has many Users. Use a plural alias.
Hospital.hasMany(User, {
  foreignKey: "hospital_id",
  as: "users", // Correct: use 'users'
});

// A User belongs to a Hospital. Use a singular alias.
User.belongsTo(Hospital, {
  foreignKey: "hospital_id",
  as: "hospital", // Correct: use 'hospital'
});

// Nodal has many Users. Use a plural alias.
Nodal.hasMany(User, {
  foreignKey: "nodal_id",
  as: "users", // Correct: use 'users'
});

// A User belongs to a Nodal. Use a singular alias.
User.belongsTo(Nodal, {
  foreignKey: "nodal_id",
  as: "nodal", // Correct: use 'nodal'
});

// A Nodal has many Hospitals. Use a plural alias.
Nodal.hasMany(Hospital, {
  foreignKey: "nodal_id",
  as: "hospitals", // Correct: use 'hospitals'
});

// A Hospital belongs to a Nodal. Use a singular alias.
Hospital.belongsTo(Nodal, {
  foreignKey: "nodal_id",
  as: "nodal", // Correct: use 'nodal'
});

NodalInstrument.belongsTo(Nodal, {
  foreignKey: "nodalid", // This should match the column name in NodalInstrument
  targetKey: "id", // This is the primary key in Nodal table
  as: "nodal",
});

// NodalInstrument belongs to Instrument through instrumentId
NodalInstrument.belongsTo(Instrument, {
  foreignKey: "instrumentId", // This should match the column name in NodalInstrument
  targetKey: "id", // This is the primary key in Instrument table
  as: "instrument",
});

module.exports = {
  Investigation,
  Hospital,
  ProfileEntry,
  Nodal,
  NodalHospital,
  Profile,
  Doctor,
  Technician,
  Reception,
  Phlebotomist,
  User,
  Department,
  Subdepartment,
  HospitalType,
  Hospital,
  NodalInstrument,
  Instrument,
};
