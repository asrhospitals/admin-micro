const Router=require('express');
const { getBioChemTest, addTestResult, sendTestResult, rejectTests, getRedoTests } = require('../../controller/technicianConroller/biochemistryController');
const { getMicroTest, addTestResults, sendTestResults, rejectTest, getRedoTest } = require('../../controller/technicianConroller/microbiologyController');
const { getPathologyTest } = require('../../controller/technicianConroller/pathologyController');
const router=Router();

///////////----------Handle BioChemistry Routes--------------/////////

//Get all tests that belongs to BioChemistry Module or Department
router.route('/get-biochem-tests').get(getBioChemTest);
// Add Test result to patient accoroding to test id
router.route('/add-biochem-result').put(addTestResult);
// Send test result to Doctor
router.route('/send-biochem-result').put(sendTestResult);
// Reject tests
router.route('/reject-biochem-test').put(rejectTests);
// Redo tests
router.route('/redo-biochem-test').get(getRedoTests);




///////////----------Handle Microbiology Routes--------------/////////

//Get all tests that belongs to Microbiology Module or Department
router.route('/get-micro-tests').get(getMicroTest);
// Add Test result to patient accoroding to test id
router.route('/add-micro-test-results').put(addTestResults);
// Send test result to Doctor
router.route('/send-micro-test-results').put(sendTestResults);
// Reject tests
router.route('/reject-micro-test').put(rejectTest);    
// Redo tests
router.route('/redo-micro-test').get(getRedoTest);









///////////----------Handle Pathology Routes--------------/////////

//Get all tests that belongs to Pathology Module or Department

router.route('/get-pathology-tests').get(getPathologyTest);

module.exports=router;