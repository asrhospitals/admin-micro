const Patient = require("../patientRegistrationModel/patientRegistrationModel");
const Investigation = require("../adminModel/masterModel/investigation");
const PatientTest = require("../patientTestModel/patientTest");
const Hospital = require("../adminModel/masterModel/hospitalMaster");
const ProfileEntryMaster = require("../adminModel/masterModel/profileentrymaster");
const Profile = require('../adminModel/masterModel/profileMaster');
const Nodal = require("../adminModel/masterModel/nodalMaster");
const NodalHospital = require("../adminModel/masterModel/attachNodalHospitalMaster");
const InvestigationResult=require('../adminModel/masterModel/investigationResult');
const NormalValue=require('../adminModel/masterModel/normalValue');



// Associations


// 1. Investigation → InvestigationResults
Investigation.hasMany(InvestigationResult, {
  foreignKey: 'investigationId',
  as: 'results',
  onDelete: 'CASCADE'
});
InvestigationResult.belongsTo(Investigation, {
  foreignKey: 'investigationId',
  as: 'investigation'
});

// 2. InvestigationResult → NormalValues
InvestigationResult.hasMany(NormalValue, {
  foreignKey: 'resultId',
  as: 'normalValues',
  onDelete: 'CASCADE'
});
NormalValue.belongsTo(InvestigationResult, {
  foreignKey: 'resultId',
  as: 'result'
});


// ✅ Patient ↔ PatientTest
Patient.hasMany(PatientTest, { foreignKey: "patient_id", as: "patientTests" });
PatientTest.belongsTo(Patient, { foreignKey: "patient_id", as: "patient" });

// ✅ Investigation ↔ PatientTest
Investigation.hasMany(PatientTest, { foreignKey: "investigation_id", as: "investigationTests" });
PatientTest.belongsTo(Investigation, { foreignKey: "investigation_id", as: "investigation" });

// ✅ Hospital ↔ PatientTest
Hospital.hasMany(PatientTest, { foreignKey: "hospitalid", as: "hospitalTests" });
PatientTest.belongsTo(Hospital, { foreignKey: "hospitalid", as: "hospital" });


// ProfileEntryMaster - Investigation many-to-many
Investigation.belongsToMany(ProfileEntryMaster, {
  through: Profile,
  foreignKey: 'investigationid',
  otherKey: 'profileid'
});

ProfileEntryMaster.belongsToMany(Investigation, {
  through: Profile,
  foreignKey: 'profileid',
  otherKey: 'investigationid'
});

// Patient - Investigation many-to-many via PatientTest
Patient.belongsToMany(Investigation, {
  through: PatientTest,
  foreignKey: 'patient_id',
  otherKey: 'id'
});

Investigation.belongsToMany(Patient, {
  through: PatientTest,
  foreignKey: 'id',
  otherKey: 'patient_id'
});


// Nodal - NodalHospital one-to-many
//NodalHospital belongs to Nodal through nodalid
NodalHospital.belongsTo(Nodal, { 
  foreignKey: 'nodalid',  // This should match the column name in NodalHospital
  targetKey: 'id',        // This is the primary key in Nodal table
  as: 'nodal' 
});

// NodalHospital belongs to Hospital through hospitalid
NodalHospital.belongsTo(Hospital, { 
  foreignKey: 'hospitalid',  // This should match the column name in NodalHospital
  targetKey: 'id',           // This is the primary key in Hospital table
  as: 'hospital' 
});
      

module.exports = {
  Patient,
  Investigation,
  PatientTest,
  Hospital,
  ProfileEntryMaster,
  Nodal,
  NodalHospital,
  Profile

};