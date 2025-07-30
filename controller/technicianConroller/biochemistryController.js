const {
  PatientTest,
  Patient,
  Investigation,
  Hospital,
} = require("../../model/associatemodels/associatemodel");

const {Op}=require('sequelize');

// A. Get all tests that belongs to Bio-Chemistry Module or Department Where the status is technician
// This function retrieves all biochemistry tests that are currently in the "technician" status.

const getBioChemTest = async (req, res) => {
  try {
    /// Access control for BioChemistry Module
        if (req.user.module?.toLowerCase() !== "biochemistry") {
          return res.status(403).json({
            message: "Access denied. Only Biochemistry users can access this resource.",
          });
        }
   
    /// 1. Get Data from Patient Test Table
    const allBioChem = await PatientTest.findAll({
      where: {
        status: "technician", // <- Must match DB spelling
      },
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: [
            "id",
            "pname",
            "pregdate",
            "pbarcode",
            "registration_status",
          ],
        },
        {
          model: Investigation,
          as: "investigation",
          attributes: ["id", "testname", "department"],
          where: {
            department: "BIOCHEMISTRY", // <- Must match DB spelling
          },
        
        },
        {
          model: Hospital,
          as: "hospital",
          attributes: ["hospitalname"],
        },
      ],
    });

    /// Add a check to see if there are no tests found
    if (allBioChem.length === 0) {
      return res.status(404).json({
        message: "No biochemistry tests found",
      });
    }

    //2. Group By Department that is only BioChemistry
    // Group by only biochemistry test to a patient
    const groupedByPatient = {};

    allBioChem.forEach((test) => {
      const patientId = test.patient_id;
      const plainTest = test.get({ plain: true }); // Convert Sequelize instance to plain object
      if (!groupedByPatient[patientId]) {
        groupedByPatient[patientId] = {
          patient_id: patientId,
          patient_name: plainTest.patient.pname,
          patient_regdate: plainTest.patient.pregdate,
          patient_barcode: plainTest.patient.pbarcode,
          registration_status: plainTest.patient.registration_status,
          hospital_name: plainTest.hospital.hospitalname,
          tests: [],
        };
      }

      groupedByPatient[patientId].tests.push({
        patient_test_id: plainTest.patient_test_id,
        investigation_id: plainTest.investigation_id,
        testname: plainTest.investigation.testname,
        department: plainTest.investigation.department,
        status: plainTest.status,
        rejection_reason: plainTest.rejection_reason,
        createdAt: plainTest.test_created_date,
        updatedAt: plainTest.test_updated_date,
      });
    });

    // Convert to array
    const groupedResults = Object.values(groupedByPatient);

    return res.status(200).json({
      message: "Test Details of Bio-Chemistry been fetched successfully",
      data: groupedResults,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong while fetching tests",
    });
  }
};


// B. Add test result for each test by technician identification by test id according to the patient id

const addTestResult = async (req, res) => {

  try {

        if (req.user.module?.toLowerCase() !== "biochemistry") {
        return res.status(403).json({
        message: 'Access denied: Only biochemistry users can update test results',
      });
    }


    // Handle multiple test results via request body
    if (req.body.test_results && Array.isArray(req.body.test_results)) {
       const { test_results } = req.body;
      
      if (test_results.length === 0) {
        return res.status(400).json({ message: 'No test results provided' });
      }
      
      let updatedCount = 0;
      for (const item of test_results) {
        const { patient_test_id, test_result, test_image } = item;
        
        // Skip invalid entries
        if (!patient_test_id || !test_result) {
          continue;
        }
        
        // Update the test result
        await PatientTest.update(
          { test_result, test_image },
          { where: { patient_test_id } }
        );
        
        updatedCount++;
      }
      
      return res.status(200).json({
        message: `Successfully updated ${updatedCount} test result(s)`
      });
      
    } 
    
       // Handle single test result (existing functionality)
    else {

      // const { patient_test_id } = req.params;
      const {patient_test_id,test_result,test_image } = req.body;
     
    // Update the test result and image
     await PatientTest.update(
      {
        test_result,
        test_image,
      },
      {
        where: {
        patient_test_id
        },

      }
    );
  
    return res.status(200).json({
      message: "Test result updated successfully",
    });
      
    }
    
  } catch (error) { 
    res.status(500).json({
      message: error.message || "Something went wrong while updating the test result",
    });
  }
};


// C. Send Test Result to the Doctor

const sendTestResult = async (req, res) => {
  try {
    // Collect all the Patient data to send
    const { patient_test_ids } = req.body;
     // Check if the user is from the biochemistry department
    if (req.user.module?.toLowerCase() !== "biochemistry") {
      return res.status(403).json({
        message: 'Access denied: Only biochemistry users can update test results',
      });
    }

    // Update the test result and image
   const [sendSample]= await PatientTest.update(
      {
        status:"doctor"
      },
      {
        where: {
          patient_test_id: patient_test_ids,
          status: "technician",
          test_result: {
            [Op.ne]: null, // Ensure test_result is not null
          },
        },
      }
    );

    return res.status(200).json({
      message: "Test result sent to doctor successfully",
      data: sendSample,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong while sending the test result",
    });
  }
} 


// D. Reject Tests
const rejectTests = async (req, res) => {
  try {

    // Collect all the Patient data to send
    const { patient_test_ids, rejection_reason } = req.body;
     // Check if the user is from the biochemistry department
    if (req.user.module?.toLowerCase() !== "biochemistry") {
      return res.status(403).json({
        message: 'Access denied: Only biochemistry users can update test results',
      });
    }

    // Update the test result and image
   const [rejectSample]= await PatientTest.update(
      {
        status:"rejected",
        rejection_reason: rejection_reason,
      },
      {
        where: {
          patient_test_id: patient_test_ids,
          status: "technician",
          test_result: {
            [Op.ne]: null, // Ensure test_result is not null
          },
        },
      }
    );

    return res.status(200).json({
      message: "Test result rejected successfully",
      data: rejectSample,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong while rejecting the test result",
    });
    
  }
} 


// E. Redo Tests

const getRedoTests = async (req, res) => {
  try {
    /// Access control for BioChemistry Module
        if (req.user.module?.toLowerCase() !== "biochemistry") {
          return res.status(403).json({
            message: "Access denied. Only Biochemistry users can access this resource.",
          });
        }
   
    /// 1. Get Data from Patient Test Table
    const allBioChem = await PatientTest.findAll({
      where: {
        status: "redo",
      },
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: [
            "id",
            "pname",
            "pregdate",
            "pbarcode",
            "registration_status",
          ],
        },
        {
          model: Investigation,
          as: "investigation",
          attributes: ["id", "testname", "department"],
          where: {
            department: "BIOCHEMISTRY", // <- Must match DB spelling
          },
        
        },
        {
          model: Hospital,
          as: "hospital",
          attributes: ["hospitalname"],
        },
      ],
    });

    /// Add a check to see if there are no tests found
    if (allBioChem.length === 0) {
      return res.status(404).json({
        message: "No Redo tests found",
      });
    }

    //2. Group By Department that is only BioChemistry
    // Group by only biochemistry test to a patient
    const groupedByPatient = {};

    allBioChem.forEach((test) => {
      const patientId = test.patient_id;
      const plainTest = test.get({ plain: true }); // Convert Sequelize instance to plain object
      if (!groupedByPatient[patientId]) {
        groupedByPatient[patientId] = {
          patient_id: patientId,
          patient_name: plainTest.patient.pname,
          patient_regdate: plainTest.patient.pregdate,
          patient_barcode: plainTest.patient.pbarcode,
          registration_status: plainTest.patient.registration_status,
          hospital_name: plainTest.hospital.hospitalname,
          tests: [],
        };
      }

      groupedByPatient[patientId].tests.push({
        patient_test_id: plainTest.patient_test_id,
        investigation_id: plainTest.investigation_id,
        testname: plainTest.investigation.testname,
        department: plainTest.investigation.department,
        status: plainTest.status,
        test_result: plainTest.test_result,
        rejection_reason: plainTest.rejection_reason,
        createdAt: plainTest.test_created_date,
        updatedAt: plainTest.test_updated_date,
      });
    });

    // Convert to array
    const groupedResults = Object.values(groupedByPatient);

    return res.status(200).json({
      message: "Redo tests fetched successfully",
      data: groupedResults,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong while fetching tests",
    });
  }
};





module.exports = { getBioChemTest, addTestResult, sendTestResult,rejectTests,getRedoTests };
 