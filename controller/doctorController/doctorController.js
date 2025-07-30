const {PatientTest,Investigation,Hospital,Patient} = require('../../model/associatemodels/associatemodel'); 
const { Op } = require('sequelize');



// A. Get All Tests Send by Technician

const getAllTestsSendByTechnician = async (req, res) => {

    try {

        if(req.user.module?.toLowerCase() !== "biochemistry" || req.user.role?.toLowerCase() !== "doctor") {
            return res.status(403).json({ message: "Access denied. Only doctors can access this resource." });
        }

        const biochem = await PatientTest.findAll({
            where: {
               status: "doctor",
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

        if (biochem.length === 0) {
            return res.status(404).json({ message: "No test are available now" });
        }

        
    //2. Group By Department that is only BioChemistry
    // Group by only biochemistry test to a patient
    const groupedByPatient = {};

    biochem.forEach((test) => {
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
        test_result: plainTest.test_result,
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
     res.status(500).json({ message: "Internal server error." });
    }
};


// B. Update the test result of a patient

const updateTestResult = async (req, res) => {

  try {

        if(req.user.module?.toLowerCase() !== "biochemistry" || req.user.role?.toLowerCase() !== "doctor") {
            return res.status(403).json({ message: "Access denied. Only doctors can access this resource." });
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
          { test_result, test_image, test_updated_date: new Date(), },
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
        test_updated_date: new Date(),
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


 
// C. Update the result status of a patient

const updateStatusToAccept = async (req, res) => {
  try {
    // Collect all the Patient data to send
    const { patient_test_ids } = req.body;
     // Check if the user is from the biochemistry department
        if(req.user.module?.toLowerCase() !== "biochemistry" || req.user.role?.toLowerCase() !== "doctor") {
            return res.status(403).json({ message: "Access denied. Only doctors can access this resource." });
        }

    // Update the test result and image
   const [acceptSample]= await PatientTest.update(
      {
        status:"accept"
      },
      {
        where: {
          patient_test_id: patient_test_ids,
          status: "doctor",
          test_result: {
            [Op.ne]: null, // Ensure test_result is not null
          },
        },
      }
    );

    return res.status(200).json({
      message: "Test result accepted successfully",
      data: acceptSample,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong while accept the test result",
    });
  }
} 


// D. Redo Tests

const redoTests = async (req, res) => {
  try {
    // Collect all the Patient data to send
    const { patient_test_ids } = req.body;
     // Check if the user is from the biochemistry department
        if(req.user.module?.toLowerCase() !== "biochemistry" || req.user.role?.toLowerCase() !== "doctor") {
            return res.status(403).json({ message: "Access denied. Only doctors can access this resource." });
        }

    // Update the test result and image
   const [redoSample]= await PatientTest.update(
      {
        status:"redo"
      },
      {
        where: {
          patient_test_id: patient_test_ids,
          status: "doctor",
          test_result: {
            [Op.ne]: null, // Ensure test_result is not null
          },
        },
      }
    );

    return res.status(200).json({
      message: "Test result redo successfully",
      data: redoSample,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong while redo the test result",
    });
  }
}


// E. Reject Tests
const rejectTests = async (req, res) => {

try {

  // Collect all the Patient data to send
  const { patient_test_ids, rejection_reason } = req.body;
   // Check if the user is from the biochemistry department
  if(req.user.module?.toLowerCase() !== "biochemistry" || req.user.role?.toLowerCase() !== "doctor") {
      return res.status(403).json({ message: "Access denied. Only doctors can access this resource." });
  }

  // Update the test result and image
 const [rejectSample]= await PatientTest.update(
    {
      status:"reject",
      rejection_reason: rejection_reason,
    },
    {
      where: {
        patient_test_id: patient_test_ids,
        status: "doctor",
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


module.exports = {getAllTestsSendByTechnician,updateTestResult,updateStatusToAccept,redoTests, rejectTests};