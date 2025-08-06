const {
  Patient,
  Investigation,
  PatientTest,
  Hospital,
} = require("../../model/associatemodels/associatemodel");
const sequelize = require("../../db/connectDB");
const { Op } = require("sequelize");

/// A.Create Patient Test Along with Patient Registration
const addPatientTest = async (req, res) => {
  try {
    // Check if the user is authenticated and has a hospitalid
    const { id: user_id, hospitalid } = req.user;

    //1. Add Patient That Store in Patient Table And Patient Test Table
    const {
      pname,
      pguardian,
      page,
      pgender,
      pbarcode,
      refdoc,
      area,
      city,
      district,
      pop,
      popno,
      pregdate,
      pmobile,
      whatsappnumber,
      emailid,
      trfno,
      remark,
      attatchfile,
      investigation_ids,
    } = req.body;

    // Create Patient Registration
    const createPatient = await Patient.create({
      pname,
      pguardian,
      page,
      pgender,
      pbarcode,
      refdoc,
      area,
      city,
      district,
      pop,
      popno,
      pregdate,
      pmobile,
      whatsappnumber,
      emailid,
      trfno,
      remark,
      attatchfile,
      hospitalid,
      created_by: user_id,
    });

    /// Get the Patient ID
    const patient_id = createPatient.id;

    console.log("Patient ID-------------:", patient_id);

    // 2. Validate the Hospital Is available or not

    const hospital = await Hospital.findByPk(hospitalid);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found." });
    }

    // 3. Check the Investigation Is available or not
    const investigations = await Investigation.findAll({
      where: {
        id: {
          [Op.in]: investigation_ids,
        },
      },
    });

    if (
      !investigations.length ||
      investigations.length !== investigation_ids.length
    ) {
      return res
        .status(400)
        .json({ message: "Some investigation IDs are invalid." });
    }

    // 4. Create Patient Test Order
    const patienttests = investigation_ids.map((investigation_id) => ({
      patient_id,
      investigation_id,
      hospitalid,
      status: "center",
    }));

    await PatientTest.bulkCreate(patienttests);

    return res.status(201).json({ message: "Test added successfully" });
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while creating the patient test order.",
    });
  }
};


///B. Get All Patient Tests along with Patient details and Hospital name

const getPatientTest = async (req, res) => {
  try {
    // Check if the user is authenticated and has a hospitalid
    const { hospitalid } = req.user;

    // Need Details By hospital Name
    const { hospitalname } = req.params;


    // Get current date in 'YYYY-MM-DD' format
    const currentDate = new Date()
      .toLocaleString("en-CA", { timeZone: "Asia/Kolkata" })
      .split(",")[0];


      

    // Get Hospital Details by Name
    const hospital = await Hospital.findOne({
      where: { id: hospitalid, hospitalname: hospitalname },
    });

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Get all Patient Tests details by Hospital ID and Current Date
    const patientTests = await PatientTest.findAll({
      where: {
        hospitalid: hospital.id,
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
            pregdate: currentDate,
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




    // Check if any patient tests were not found

    if (!patientTests.length) {
      return res
        .status(404)
        .json({ message: "No patient tests found for today." });
    }
    // Group tests by patient_id using forEach
    const groupedByPatient = {};

    patientTests.forEach((test) => {
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
        createdAt: plainTest.createdAt,
        updatedAt: plainTest.updatedAt,
      });
    });

    // Convert to array
    const groupedResults = Object.values(groupedByPatient);

    res.status(200).json({
      message: "Patient tests fetched successfully",
      data: groupedResults,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message:
        err.message || "Something went wrong while fetching patient tests.",
    });
  }
};

/// C. Update Patient Deatails by Patient ID
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.patient_id);
    patient.update(req.body);
    return res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: patient,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// D. Update the Patient Test Status by Patient

const updateTestStatus = async (req, res) => {
  try {
    const { patient_ids } = req.body;
    // Validate input
    if (!Array.isArray(patient_ids) || patient_ids.length === 0) {
      return res.status(400).json({ message: "Select Patients to send " });
    }
    const [updateTest] = await PatientTest.update(
      { status: "node" },
      {
        where: {
          patient_id: patient_ids,
        },
      }
    );
    return res.status(200).json({
      message: "Patient test status updated successfully",
      data: updateTest,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Something went wrong while updating the status.",
    });
  }
};

module.exports = {
  addPatientTest,
  getPatientTest,
  updatePatient,
  updateTestStatus,
};
