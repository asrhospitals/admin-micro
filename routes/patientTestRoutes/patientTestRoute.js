const Router=require('express');
const { addPatientTest, getPatientTest, updatePatient, updateTestStatus } = require('../../controller/patientTestsController/patientTestcontroller');
const { fetchProfile } = require('../../controller/adminController/masterController/profileMaster');
const { getTestByCode } = require('../../controller/adminController/masterController/testMaster');
const router=Router();

// Add Patient Test
router.route('/add-test').post(addPatientTest);
// Get Patient Test
router.route('/get-test-detail/:hospitalname').get(getPatientTest);
// Update Patient Data
router.route('/update-patient/:patient_id').put(updatePatient);
// Get Profiles of Tests 
router.route('/get-profile').get(fetchProfile);
// Get Test By Test Code
router.route('/get-test-code/:testcode').get(getTestByCode);
// Update Patient Test Status by Patient ID
router.route('/update-test-status').put(updateTestStatus);



module.exports=router;