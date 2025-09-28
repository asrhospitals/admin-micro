const Router=require('express');
const router=Router();
const { addDepartment, getDepartment, updateDepartment, getDepartmentById, getAllDepartments } = require('../../controller/adminController/masterController/departmentMaster');
const { addSubDepartment, getSubDepartment, updateSubDepartment, getById, getAllSubdepartments } = require('../../controller/adminController/masterController/subdepartmentMaster');
const { addhsptltype, gethsptltype, updatehsptltype, getHospitalTypeById, getAllHospitalType } = require('../../controller/adminController/masterController/hospitaltypeMaster');
const { addhospital, gethospital, updatehospital, getHospitalById, getAllHospitals } = require('../../controller/adminController/masterController/hospitalMaster');
const { addNodal, getNodal, updateNodal, getNodalById, getAllNodals } = require('../../controller/adminController/masterController/nodalMaster');
const { addRole, getRole, updateRole, getRoleById, getAllRoles } = require('../../controller/adminController/masterController/roletypeMaster');
const { addPhlebo, getPhlebo, updatePhlebo, getPhleboById } = require('../../controller/adminController/masterController/phlebotomistMaster');
const { addReception, getReception, updateReception, getReceptionById } = require('../../controller/adminController/masterController/receptionMaster');
const { addNodalHospital, getNodalHospital, updateNodalHospital, getNodalHospitalById } = require('../../controller/adminController/masterController/attachNodalHospital');
const { addlabtolab, getlabtolab, updatelabtolab, getLabById } = require('../../controller/adminController/masterController/labtolabMaster');
const { addInstrument, getInstrument, updateInstrument, getInstrumentById, getAllInstrument } = require('../../controller/adminController/masterController/instrumentMaster');
const { addNodalInstrument, getNodalInstrument, updateNodalInstrument, getNodalInstrumentById } = require('../../controller/adminController/masterController/attachedNodalInstrumentMaster');
const { addTechnician, getTechnician, updateTechnician, getTechnicianById } = require('../../controller/adminController/masterController/technicianMaster');
const { addRefDoctor, getRefDoc, updateRefDoc, getRefDocById } = require('../../controller/adminController/masterController/referDoctor');
const { addProfile, getProfile, updateProfile, getProfileEntryById, getAllProfileEntry } = require('../../controller/adminController/masterController/profileentrymaster');
const { addTest, getTest, updateNormalValues, updateInvestigation, getTestById, updateSingleResult } = require('../../controller/adminController/masterController/testMaster');
const { createProfile, fetchProfile, updateProfiles, fetchProfileById } = require('../../controller/adminController/masterController/profileMaster');
const { addDoctor, getDoctor, updateDoctor, getDoctorById } = require('../../controller/adminController/masterController/doctorRegistration');
const { createSpecimenType, getSpecimenTypeById, getAllSpecimenTypes, updateSpecimenType, getAllSpecimen } = require('../../controller/adminController/masterController/specimenMaster');
const { createColor, getAllColors, getColorById, updateColor } = require('../../controller/adminController/masterController/colormaster');
const { createKit, getAllKits, getKitById, updateKit } = require('../../controller/adminController/masterController/kitmaster');
const { createReportType, getAllReportTypes, getReportTypeById, updateReportType, getAllReport } = require('../../controller/adminController/masterController/reportTypeMaster');
const { addAcesstion, getBarcode } = require('../../controller/adminController/masterController/accession');



/// 1. ---------Department Master--------------
// 1. Add Department
router.route('/add-department').post(addDepartment);
// 2. Get Department
router.route('/get-department').get(getDepartment);
// 3. Get Department By Id
router.route('/get-department/:id').get(getDepartmentById);
// 4. Update Department
router.route('/update-department/:id').put(updateDepartment);
// 5. Get All Departments
router.route('/get-all-departments').get(getAllDepartments);

/// 2. ---------- Subdepartment Master--------------
// 6. Add Sub Department
router.route('/add-subdepartment').post(addSubDepartment);
// 7. Get Sub Department
router.route('/get-subdepartment').get(getSubDepartment);
// 8. Get Sub Department By Id
router.route('/get-subdepartment/:id').get(getById); 
// 9. Update Sub Department
router.route('/update-subdepartment/:id').put(updateSubDepartment);
// 10. Get All Sub Departments
router.route('/get-all-subdpt').get(getAllSubdepartments);
 
/// 3. ------------ Hospital Type Master----------------
// 11. Add Hospital Type
router.route('/add-hsptltype').post(addhsptltype);
// 12. Get Hospital type
router.route('/get-hsptltype').get(gethsptltype);
// 13. Get Hospital Type By Id
router.route('/get-hsptltype/:id').get(getHospitalTypeById);
// 14. Update Hospital Type
router.route('/update-hsptltype/:id').put(updatehsptltype);
// 15. Get All Hospital Types
router.route('/get-all-hospitaltype').get(getAllHospitalType);

/// 4. ----------- Hospital Master---------------
// 16. Add Hospital
router.route('/add-hospital').post(addhospital);
// 17. Get Hospital
router.route('/get-hospital').get(gethospital);
// 18. Get hospital By Id
router.route('/get-hospital/:id').get(getHospitalById);
// 19. Update Hospital
router.route('/update-hospital/:id').put(updatehospital);
// 20. Get All Hospitals
router.route('/get-all-hospital').get(getAllHospitals);


/// 5. -------------- Nodal Master--------------
// 21. Add Nodal
router.route('/add-nodal').post(addNodal);
// 22. Get Nodal
router.route('/get-nodal').get(getNodal);
// 23. Get Nodal By Id
router.route('/get-nodal/:id').get(getNodalById);
// 24. Update Nodal
router.route('/update-nodal/:id').put(updateNodal);
// 25. Get All nodal
router.route('/get-all-nodals').get(getAllNodals);

/// 6. --------------Attach Nodal Hospital------------
// 26. Add Nodal Hospitals
router.route('/add-nodalhospital').post(addNodalHospital);
// 27. Get Nodal Hospitals
router.route('/get-nodalhospital').get(getNodalHospital);
// 28. Get Nodal Hospitals By Id
router.route('/get-nodalhospital/:id').get(getNodalHospitalById);
// 29. Update Nodal Hospitals
router.route('/update-nodalhospital/:id').put(updateNodalHospital);

/// 7. --------------Technician Master--------
// 30. Add Technician
router.route('/add-tech').post(addTechnician);
// 31. Get Technician
router.route('/get-tech').get(getTechnician);
// 32. Get Technician By Id
router.route('/get-tech/:id').get(getTechnicianById);
// 33. Update Technician
router.route('/update-tech/:id').put(updateTechnician);

/// 8. ----------- Reception Master-----------
// 34. Add Reception
router.route('/add-recep').post(addReception);
// 35. Get Reception
router.route('/get-recep').get(getReception);
// 36. Get Reception By Id
router.route('/get-recep/:id').get(getReceptionById);
// 37. Update Reception
router.route('/update-recep/:id').put(updateReception);

/// 9. ----------- Phlebotomist Master---------------
// 38. Add Phlebo
router.route('/add-phlebo').post(addPhlebo);
// 39. Get Phlebo
router.route('/get-phlebo').get(getPhlebo);
// 40. Get Phlebo By Id
router.route('/get-phlebo/:id').get(getPhleboById);
// 41. Update Phlebo
router.route('/update-phlebo/:id').put(updatePhlebo);

// 10. -----------Doctor Registration Master--------------
// 41. Add Doctor
router.route('/add-doctor').post(addDoctor);
// 42. Get Doctor
router.route('/get-doctor').get(getDoctor);
// 43. Get Doctor By Id
router.route('/get-doctor/:id').get(getDoctorById);
// 44. Update Doctor
router.route('/update-doctor/:id').put(updateDoctor);

/// 11. ----------- Investigation Master----------
// 45. Add Investigation
router.route('/add-test').post(addTest);
// 46. Get Investigation
router.route('/get-test').get(getTest);
// 47. Get Investigation By Id
router.route('/get-test/:id').get(getTestById);
// 48. Update Investigation 
router.route('/update-investigations/:id').put(updateInvestigation);
// 49. Update Investigation Results
router.route('/update/:investigationId/results/:resultId').put(updateSingleResult);
// 50. Update Investigation Normal Values
router.route('/update-normal/:resultId/normal-values/:normalValueId').put(updateNormalValues);

/// 12. ------------Lab to Lab Master-----------
// 51. Add Lab to Lab
router.route('/add-labtolab').post(addlabtolab);
// 52. Get Lab to Lab
router.route('/get-labtolab').get(getlabtolab);
// 53. Get Lab to Lab By Id
router.route('/get-labtolab/:id').get(getLabById);
// 54. Update Lab to Lab    
router.route('/update-labtolab/:id').put(updatelabtolab);

/// 13.---------------- Lab Instrument Master-----------
// 55. Add Lab Instrument
router.route('/add-instrument').post(addInstrument);
// 56. Get Lab Instrument
router.route('/get-instrument').get(getInstrument);
// 57. Get Lab Instrument By Id
router.route('/get-instrument/:id').get(getInstrumentById);
// 58. Update Lab Instrument
router.route('/update-instrument/:id').put(updateInstrument);
// 59. Get All Instrumets
router.route('/get-all-instrument').get(getAllInstrument)

/// 14.------------Specimen Type Master------------
//60. Add Specimen
router.route('/add-specimen').post(createSpecimenType);
//61. Get Specimen
router.route('/get-specimen').get(getAllSpecimenTypes);
//62. Get Specimen By Id
router.route('/get-specimen/:id').get(getSpecimenTypeById);
//62. Update Specimen
router.route('/update-specimen/:id').put(updateSpecimenType);
//63. Get all Instrumets
router.route('/get-all-specimen').get(getAllSpecimen);

/// 15.--------------Profile Entry Master------------------
// 63. Add Profile Entry
router.route('/add-profileentry').post(addProfile);
// 64. Get Profile Entry
router.route('/get-profileentry').get(getProfile);
// 65.Get Profile By Id
router.route('/get-profileentry/:id').get(getProfileEntryById);
// 66. Update Profile By Id
router.route('/update-profileentry/:id').put(updateProfile);
// 67. Get All Profile Entries
router.route('/get-all-profileentry').get(getAllProfileEntry);

/// 16.--------------- Role Master------------------
// 68.Add Role 
router.route('/add-role').post(addRole);
// 69.Get Role
router.route('/get-role').get(getRole);
// 70.Get Role By Id
router.route('/get-role/:id').get(getRoleById);
// 71.Update Role
router.route('/update-role/:id').put(updateRole);
// 72. Get All Roles
router.route('/get-all-roles').get(getAllRoles);

/// 17.---------------Attach Nodal Instrument Master--------------
// 73. Add Nodal Instrument
router.route('/add-nodalinstrument').post(addNodalInstrument);
// 74.Get Nodal Instrument    
router.route('/get-nodalinstrument').get(getNodalInstrument);
// 75.Get Nodal By Id
router.route('/get-nodalinstrument/:id').get(getNodalInstrumentById);
// 76. Update Nodal Instrument
router.route('/update-nodalinstrument/:id').put(updateNodalInstrument);


/// 18.---------- Profile Master------------
// 77. Create Profile
router.route('/add-profile').post(createProfile);
// 78. Get Profile
router.route('/get-profile').get(fetchProfile);
// 79.Get Profile By Id
router.route('/get-profile/:id').get(fetchProfileById);
// 80. Update Profile
router.route('/update-profile/:id').put(updateProfiles);

/// 19.------------Referral Doctor Master-----------
// 81. Add Referral Doctor
router.route('/add-refdoc').post(addRefDoctor);
// 82. Get Referral Doctor
router.route('/get-refdoc').get(getRefDoc);
// 83. Get Referral Doctor By Id
router.route('/get-refdoc/:id').get(getRefDocById);
// 84. Update Referral Doctor
router.route('/update-refdoc/:id').put(updateRefDoc);


/// 20.-------------Color Master---------------------
// 85. Add Color
router.route('/add-color').post(createColor);
// 86. Get All Color
router.route('/get-color').get(getAllColors);
// 87. Get Color By Id
router.route('/get-color/:id').get(getColorById);
// 89. Update Color
router.route('/update-color/:id').put(updateColor)

/// 21.------------- Kit Master----------------------
// 90. Add Kit
router.route('/add-kit').post(createKit);
// 92. Get Kit
router.route('/get-kit').get(getAllKits);
// 98. Get Kit By Id
router.route('/get-kit/:id').get(getKitById);
// 99. Update Kit
router.route('/update-kit/:id').put(updateKit);


// 22. -------------------Report Type Masters--------------
// 100. Add Reports
router.route('/add-report').post(createReportType);
// 101. Get Reports
router.route('/get-report').get(getAllReportTypes);
// 102. Get Report By Id 
router.route('/get-report/:id').get(getReportTypeById);
// 103. Update Report
router.route('/update-report/:id').put(updateReportType);
// 104. Get All Report Type
router.route('/get-all-reports').get(getAllReport);

// 23.------------Accession Master-----------------

// 105. Add Accession
router.route('/add-accession').post(addAcesstion);
// 106. Get Barcode
router.route('/get-barcode/:id').get(getBarcode);



module.exports=router;