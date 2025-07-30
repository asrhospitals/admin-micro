const PatientTest = require("../../model/patientTestModel/patientTest");
const Hospital = require("../../model/adminModel/masterModel/hospitalMaster");
const { fn, col } = require("sequelize");
const {
  Patient,
  Investigation,
} = require("../../model/associatemodels/associatemodel");

//1. Get all Tests from a center
const getCenterSample = async (req, res) => {
  try {
    // Get the current date in YYYY-MM-DD format
    const todayDateOnly = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    // Get The Details of the Center Sample
    const patientTests = await PatientTest.findAll({
      where: {
        status: "node",
        test_created_date: todayDateOnly,
      },
      attributes: [
        [fn("COUNT", col("patient_test_id")), "total_tests"],
        [col("hospital.hospitalname"), "hospitalname"],
      ],
      include: [
        {
          model: Hospital,
          as: "hospital",
          attributes: [],
          required: true,
        },
      ],

      group: ["hospital.hospitalname"],
    });
    if (!patientTests.length) {
      return res
        .status(404)
        .json({ message: "No patient tests found for today." });
    }
    res.status(200).json({
      message: "Patient tests fetched successfully",
      data: patientTests,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message:
        err.message || "Something went wrong while fetching patient tests.",
    });
  }
};



// 2.Accept Sample from a centers
const acceptCenterSample = async (req, res) => {
  try {
    const { hospital_names } = req.body;

    if (!Array.isArray(hospital_names) || hospital_names.length === 0) {
      return res.status(400).json({ message: "Select at least one hospital" });
    }

    // Step 1: Get hospital IDs from names
    const hospitals = await Hospital.findAll({
      where: { hospitalname: hospital_names },
      attributes: ["id"],
    });

    const hospitalIds = hospitals.map((h) => h.id);

    if (hospitalIds.length === 0) {
      return res.status(404).json({ message: "No matching hospitals found" });
    }

    // //Must be current date
    const todayDateOnly = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    const [updateTest] = await PatientTest.update(
      { status: "accept" },
      {
        where: {
          status: "node",
          hospitalid: hospitalIds,
          test_created_date: todayDateOnly,
        },
      }
    );
    return res.status(200).json({
      message: "Sample accepted successfully",
      data: updateTest,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong while accepting samples",
    });
  }
};


/// 3. Get All Details of Accepted Samples from Diffrent Hospitals
const allSamples = async (req, res) => {
  try {
    //Must be current date
    const todayDateOnly = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    const allData = await PatientTest.findAll({
      where: {
        status: "accept",
        test_created_date: todayDateOnly,
      },
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: [
            "id",
            "pname",
            "page",
            "pgender",
            "pregdate",
            "pmobile",
            "popno",
            "pop",
            "pbarcode",
            "registration_status",
          ],
          where: {
            pregdate: todayDateOnly,
          },
        },
        {
          model: Investigation,
          as: "investigation",
          attributes: ["id", "testname", "department"],
        },
        {
          model: Hospital,
          as: "hospital",
          attributes: ["hospitalname"],
        },
      ],
    });

    if (!allData.length) {
      return res
        .status(404)
        .json({ message: "No patient tests found for today." });
    }
    // Group tests by patient_id using forEach
    const groupedByPatient = {};
    allData.forEach((test) => {
      const patientId = test.patient_id;
      const plainTest = test.get({ plain: true }); // Convert Sequelize instance to plain object
      if (!groupedByPatient[patientId]) {
        groupedByPatient[patientId] = {
          patient_id: patientId,
          patient_name: plainTest.patient.pname,
          patient_age: plainTest.patient.page,
          patient_regdate: plainTest.patient.pregdate,
          patient_op: plainTest.patient.pop,
          patient_opno: plainTest.patient.popno,
          patient_mobile: plainTest.patient.pmobile,
          patient_barcode: plainTest.patient.pbarcode,
          registration_status: plainTest.patient.registration_status,
          patient_gender: plainTest.patient.pgender,
          hospital: {
            hospital_name: plainTest.hospital.hospitalname,
          },
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

    res.status(200).json({
      message: "Patient tests fetched successfully",
      data: groupedResults,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message || "Something went wrong while fetching sample details",
    });
  }
};


/// 4. Send Tests to Specific Departments Or Technician
const sendTest = async (req, res) => {
  try {
    // Collect all the Patient data to send
    const { patient_ids } = req.body;
    // Check Patient details added or not
    if (!Array.isArray(patient_ids) || patient_ids.length === 0) {
      return res.status(400).json({ message: "Select at least one patients" });
    }
    //Test Must be for the current date
    const todayDateOnly = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    const [sendSample] = await PatientTest.update(
      { status: "technician" },
      {
        where: {
          status: "accept",
          patient_id: patient_ids,
          test_created_date: todayDateOnly,
        },
      }
    );

    res.status(200).json({
      message: "Sample send successfully to the technician",
      data: sendSample,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          error.message ||
          "Something went wrong while send test to departments",
      });
  }
};

module.exports = { getCenterSample, acceptCenterSample, allSamples, sendTest };
