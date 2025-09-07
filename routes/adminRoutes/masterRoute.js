const Router=require('express');
const router=Router();
const { addDepartment, getDepartment, updateDepartment, getDepartmentById } = require('../../controller/adminController/masterController/departmentMaster');
const { addSubDepartment, getSubDepartment, updateSubDepartment, getById } = require('../../controller/adminController/masterController/subdepartmentMaster');
const { addhsptltype, gethsptltype, updatehsptltype, getHospitalTypeById } = require('../../controller/adminController/masterController/hospitaltypeMaster');
const { addhospital, gethospital, updatehospital, getHospitalById } = require('../../controller/adminController/masterController/hospitalMaster');
const { addNodal, getNodal, updateNodal, getNodalById } = require('../../controller/adminController/masterController/nodalMaster');
const { addRole, getRole, updateRole } = require('../../controller/adminController/masterController/roletypeMaster');
const { addPhlebo, getPhlebo, updatePhlebo, getPhleboById } = require('../../controller/adminController/masterController/phlebotomistMaster');
const { addReception, getReception, updateReception, getReceptionById } = require('../../controller/adminController/masterController/receptionMaster');
const { addNodalHospital, getNodalHospital, updateNodalHospital, getNodalHospitalById } = require('../../controller/adminController/masterController/attachNodalHospital');
const { addlabtolab, getlabtolab, updatelabtolab, getLabById } = require('../../controller/adminController/masterController/labtolabMaster');
const { addInstrument, getInstrument, updateInstrument, getInstrumentById } = require('../../controller/adminController/masterController/instrumentMaster');
const { addNodalInstrument, getNodalInstrument, updateNodalInstrument } = require('../../controller/adminController/masterController/attachedNodalInstrumentMaster');
const { addTechnician, getTechnician, updateTechnician, getTechnicianById } = require('../../controller/adminController/masterController/technicianMaster');
const { addRefDoctor, getRefDoc, updateRefDoc } = require('../../controller/adminController/masterController/referralMaster');
const { addProfile, getProfile, updateProfile } = require('../../controller/adminController/masterController/profileentrymaster');
const { addReport, getReport, updateReport } = require('../../controller/adminController/masterController/reportTypeMaster');
// const { addSpecimen, getSpecimen, updateSpecimen, getSpecimenById } = require('../../controller/adminController/masterController/specimenMaster');
const { addTest, getTest, updateNormalValues, updateInvestigation, updateResults, getTestById, updateSingleResult } = require('../../controller/adminController/masterController/testMaster');
const { addReagent, getReagent, updateReagent } = require('../../controller/adminController/masterController/reagentMaster');
const { addDocAuth, getDocAuth, updateDocAuth } = require('../../controller/adminController/masterController/doctorAuthMaster');
const { addColor, getColor, updateColors } = require('../../controller/adminController/masterController/colormaster');
const { addKit, getKit, updateKit } = require('../../controller/adminController/masterController/kitmaster');
const { addReportDoctor, getReportDoctor, updateReportDoctor } = require('../../controller/adminController/masterController/reportDoctor');
const { createProfile, fetchProfile, updateProfiles } = require('../../controller/adminController/masterController/profileMaster');
const { addDoctor, getDoctor, updateDoctor, getDoctorById } = require('../../controller/adminController/masterController/doctorRegistration');



/// ---------Department Master--------------
// 1. Add Department
router.route('/add-department').post(addDepartment);
// 2. Get Department
router.route('/get-department').get(getDepartment);
// 3. Get Department By Id
router.route('/get-department/:id').get(getDepartmentById);
// 4. Update Department
router.route('/update-department/:id').put(updateDepartment);

///---------- Subdepartment Master--------------
// 5. Add Sub Department
router.route('/add-subdepartment').post(addSubDepartment);
// 6. Get Sub Department
router.route('/get-subdepartment').get(getSubDepartment);
// 7. Get Sub Department By Id
router.route('/get-subdepartment/:id').get(getById); 
// 8. Update Sub Department
router.route('/update-subdepartment/:id').put(updateSubDepartment);

///------------ Hospital Type Master----------------
// 9. Add Hospital Type
router.route('/add-hsptltype').post(addhsptltype);
// 10. Get Hospital type
router.route('/get-hsptltype').get(gethsptltype);
// 11. Get Hospital Type By Id
router.route('/get-hsptltype/:id').get(getHospitalTypeById);
// 12. Update Hospital Type
router.route('/update-hsptltype/:id').put(updatehsptltype);

///----------- Hospital Master---------------
// 13. Add Hospital
router.route('/add-hospital').post(addhospital);
// 14. Get Hospital
router.route('/get-hospital').get(gethospital);
// 15. Get hospital By Id
router.route('/get-hospital/:id').get(getHospitalById);
// 16. Update Hospital
router.route('/update-hospital/:id').put(updatehospital);

///--------------- Nodal Master--------------
// 17. Add Nodal
router.route('/add-nodal').post(addNodal);
// 18. Get Nodal
router.route('/get-nodal').get(getNodal);
// 19. Get Nodal By Id
router.route('/get-nodal/:id').get(getNodalById);
// 20. Update Nodal
router.route('/update-nodal/:id').put(updateNodal);

/// --------------Attach Nodal Hospital------------
// 21. Add Nodal Hospitals
router.route('/add-nodalhospital').post(addNodalHospital);
// 22. Get Nodal Hospitals
router.route('/get-nodalhospital').get(getNodalHospital);
// 23. Get Nodal Hospitals By Id
router.route('/get-nodalhospital/:id').get(getNodalHospitalById);
// 24. Update Nodal Hospitals
router.route('/update-nodalhospital/:id').put(updateNodalHospital);

/// --------------Technician Master--------
// 25. Add Technician
router.route('/add-tech').post(addTechnician);
// 26. Get Technician
router.route('/get-tech').get(getTechnician);
// 27. Get Technician By Id
router.route('/get-tech/:id').get(getTechnicianById);
// 28. Update Technician
router.route('/update-tech/:id').put(updateTechnician);

///----------- Reception Master-----------
// 29. Add Reception
router.route('/add-recep').post(addReception);
// 30. Get Reception
router.route('/get-recep').get(getReception);
// 31. Get Reception By Id
router.route('/get-recep/:id').get(getReceptionById);
// 32. Update Reception
router.route('/update-recep/:id').put(updateReception);

///--------- Phlebotomist Master---------------
// 33. Add Phlebo
router.route('/add-phlebo').post(addPhlebo);
// 34. Get Phlebo
router.route('/get-phlebo').get(getPhlebo);
// 35. Get Phlebo By Id
router.route('/get-phlebo/:id').get(getPhleboById);
// 36. Update Phlebo
router.route('/update-phlebo/:id').put(updatePhlebo);

//-----------Doctor Registration Master--------------
// 40. Add Doctor
router.route('/add-doctor').post(addDoctor);
// 41. Get Doctor
router.route('/get-doctor').get(getDoctor);
// 42. Get Doctor By Id
router.route('/get-doctor/:id').get(getDoctorById);
// 43. Update Doctor
router.route('/update-doctor/:id').put(updateDoctor);

///----------- Investigation Master----------
// 44. Add Investigation
router.route('/add-test').post(addTest);
// 45. Get Investigation
router.route('/get-test').get(getTest);
// 46. Get Investigation By Id
router.route('/get-test/:id').get(getTestById);
// 47. Update Investigation 
router.route('/update-investigations/:id').put(updateInvestigation);
// 48. Update Investigation Results
router.route('/update/:investigationId/results/:resultId').put(updateSingleResult);
// 49. Update Investigation Normal Values
router.route('/update-normal/:resultId/normal-values/:normalValueId').put(updateNormalValues);

/// ------------Lab to Lab Master-----------
// 50. Add Lab to Lab
router.route('/add-labtolab').post(addlabtolab);
// 51. Get Lab to Lab
router.route('/get-labtolab').get(getlabtolab);
// 52. Get Lab to Lab By Id
router.route('/get-labtolab/:id').get(getLabById);
// 53. Update Lab to Lab    
router.route('/update-labtolab/:id').put(updatelabtolab);

///---------------- Lab Instrument Master-----------
// 54. Add Lab Instrument
router.route('/add-instrument').post(addInstrument);
// 55. Get Lab Instrument
router.route('/get-instrument').get(getInstrument);
// 56. Get Lab Instrument By Id
router.route('/get-instrument/:id').get(getInstrumentById);
// 57. Update Lab Instrument
router.route('/update-instrument/:id').put(updateInstrument);

///------------Specimen Type Master------------
// 58. Add Specimen
// router.route('/add-specimen').post(addSpecimen);
// 59. Get Specimen
// router.route('/get-specimen').get(getSpecimen);
// 60. Get Specimen By Id
// router.route('/get-specimen/:id').get(getSpecimenById);
// 61. Update Specimen
// router.route('/update-specimen/:id').put(updateSpecimen);

/// --------------Profile Entry Master------------------
router.route('/add-profileentry').post(addProfile);
router.route('/get-profileentry').get(getProfile);
router.route('/update-profileentry/:id').put(updateProfile);

///---------- Profile Master------------
router.route('/add-profile').post(createProfile);
router.route('/get-profile').get(fetchProfile);
router.route('/update-profile/:profile_id').put(updateProfiles);








/// ---------------Attach Nodal Instrument Master--------------
router.route('/add-nodalinstrument').post(addNodalInstrument);
router.route('/get-nodalinstrument').get(getNodalInstrument);
router.route('/update-nodalinstrument/:id').put(updateNodalInstrument);

///---------------- Role Type Master------------------
router.route('/add-role').post(addRole);
router.route('/get-role').get(getRole);
router.route('/update-role/:id').put(updateRole);







/// ------------Referral Doctor Master-----------
router.route('/add-refdoc').post(addRefDoctor);
router.route('/get-refdoc').get(getRefDoc);
router.route('/update-refdoc/:id').put(updateRefDoc);

/// ------------Report Doctor Master--------------
router.route('/add-reportdoctor').post(addReportDoctor);
router.route('/get-reportdoctor').get(getReportDoctor);
router.route('/update-reportdoctor/:id').put(updateReportDoctor);




// ///-----------Report Type Master--------------
// router.route('/add-report').post(addReport);
// router.route('/get-report').get(getReport);
// router.route('/update-report/:id').put(updateReport);

///----------Reagent Master--------------
router.route('/add-reg').post(addReagent);
router.route('/get-reg').get(getReagent);
router.route('/update-reg/:id').put(updateReagent);







// ///-----------Color Master---------------------
// router.route('/add-color').post(addColor);
// router.route('/get-color').get(getColor);
// router.route('/update-color/:id').put(updateColors);


// ///----------Kit Master----------------------
// router.route('/add-kit').post(addKit);
// router.route('/get-kit').get(getKit);
// router.route('/update-kit/:id').put(updateKit);

///------------Doctor Authentication Master----------
router.route('/add-docauth').post(addDocAuth);
router.route('/get-docauth').get(getDocAuth);
router.route('/update-docauth/:id').put(updateDocAuth);



module.exports=router;