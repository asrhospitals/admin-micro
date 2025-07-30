const {
  PatientTest,
  Patient,
  Investigation,
  Hospital,
} = require("../../model/associatemodels/associatemodel");

// Get all tests that belongs to Pathology Module or Department

const getPathologyTest = async (req, res) => {
  try {
    // Access control for Pathology Module
    if (req.user.module?.toLowerCase() !== "pathology") {
      return res.status(403).json({
        message:
          "Access denied. Only Pathology users can access this resource.",
      });
    }

    // 1. Get Data from Patient Test Table
    const allPathoTest = await PatientTest.findAll({
      where: {
        status: "technician",
      },
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: [
            "patient_id",
            "patient_name",
            "patient_regdate",
            "patient_barcode",
            "registration_status",
          ],
        },
        {
          model: Investigation,
          as: "investigation",
          attributes: ["investigation_id", "testname", "department"],
          where: {
            department: "PATHOLOGY", // <- Must match DB spelling
          },
        },
        {
          model: Hospital,
          as: "Hospital",
          attributes: ["hospital_name"],
        },
      ],
    });

    /// Add a check to see if there are no tests found
    if (allPathoTest.length === 0) {
      return res.status(404).json({
        message: "No pathology tests found",
      });
    }

    // 2. Group By Department that is only Microbiology
    // Group by only microbiology test to a patient
    const groupedByPatient = {};

    allPathoTest.forEach((test) => {
      const patientId = test.patient_id;
      const plainTest = test.get({ plain: true }); // Convert Sequelize instance to plain object
      if (!groupedByPatient[patientId]) {
        groupedByPatient[patientId] = {
          patient_id: patientId,
          patient_name: plainTest.patient.patient_name,
          patient_regdate: plainTest.patient.patient_regdate,
          patient_barcode: plainTest.patient.patient_barcode,
          registration_status: plainTest.patient.registration_status,
          hospital_name: plainTest.Hospital.hospital_name,
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
      message: "Pathology tests fetched successfully",
      data: groupedResults,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {getPathologyTest};