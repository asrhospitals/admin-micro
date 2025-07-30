const Router= require('express');
const router= Router();

const {getAllTestsSendByTechnician, updateTestResult, updateStatusToAccept, redoTests, rejectTests}= require('../../controller/doctorController/doctorController');


// ----------------------------------Manage Biochemistry Doctor Routes-------------------------------

// A. Get All Tests Send by Technician
router.route('/get-biochem-tests').get(getAllTestsSendByTechnician);
// B. Update Test Results
router.route('/update-biochem-result').put(updateTestResult);
// C. Accept Test Result
router.route('/accept-biochem-result').put(updateStatusToAccept);
// D. Redo Tests
router.route('/redo-biochem-tests').put(redoTests);
// E. Rejected Tests
router.route('/reject-biochem-tests').put(rejectTests);







// ----------------------------------Manage Microbiology Doctor Routes-------------------------------

module.exports= router;