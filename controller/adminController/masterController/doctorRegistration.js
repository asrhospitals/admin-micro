const sequelize = require("../../../db/connectDB");
const Doctor = require("../../../model/adminModel/masterModel/doctorRegistration");
const User = require("../../../model/authModel/authenticationModel/userModel");
const Hospital = require("../../../model/adminModel/masterModel/hospitalMaster");
const Nodal = require("../../../model/adminModel/masterModel/nodalMaster");
const { Op } = require("sequelize");

// 0. Utility function to clean array
function cleanArray(values) {
  return values
    .flat() // flatten nested arrays
    .filter((v) => typeof v === "string" && v.trim() !== "");
}

// 1. Add Doctor
const addDoctor = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { dname, demail } = req.body;

    const existingDoctor = await Doctor.findOne({
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn("LOWER", sequelize.col("dname")),
            dname.toLowerCase()
          ),
          sequelize.where(
            sequelize.fn("LOWER", sequelize.col("demail")),
            demail.toLowerCase()
          ),
        ],
      },
      transaction,
    });

    if (existingDoctor) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Doctor name or email already exists",
        error: "DUPLICATE_DOCTOR_NAME_OR_EMAIL",
      });
    }

    await Doctor.create(req.body, {
      transaction,
    });
    await transaction.commit();
    res.status(201).json({
      message: "Doctor added successfully",
    });
  } catch (e) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${e}` });
  }
};

// 2. Get doctor
const getDoctor = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const { count, rows } = await Doctor.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["id", "ASC"]],
      include: [
        {
          model: Hospital,
          as: "hospital",
          attributes: ["hospitalname"],
        },
        {
          model: Nodal,
          as: "nodal",
          attributes: ["nodalname"],
        },
      ],
    });

    const totalpages = Math.ceil(count / limit);

    if (!rows) {
      return res.status(404).json({ message: "No doctors found" });
    }

    res.status(200).json({
      data: rows,
      meta: {
        totalItems: count,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: totalpages,
      },
    });
  } catch (e) {
    res.status(400).json({ message: `Something went wrong ${e}` });
  }
};

// 3. Get Doctor By Id
const getDoctorById = async (req, res) => {
  try {
    const get_by_id = await Doctor.findByPk(req.params.id, {
      include: [
        {
          model: Hospital,
          as: "hospital",
          attributes: ["hospitalname"],
        },
        {
          model: Nodal,
          as: "nodal",
          attributes: ["nodalname"],
        },
      ],
    });
    if (!get_by_id) {
      return res
        .status(404)
        .json({ message: `No doctor found for this id ${req.params.id}` });
    }
    res.status(200).json(get_by_id);
  } catch (error) {
    res.status(400).json({ message: `Something went wrong ${error}` });
  }
};

// 4. Update Doctor
const updateDoctor = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    //
    if (!doctor) {
      return res
        .status(404)
        .json({ message: `Doctor not found for this id ${req.params.id}` });
    }
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Update data not provide" });
    }

    // check duplicate doctor email before update
    if (req.body.demail && req.body.demail !== doctor.demail) {
      const existingDoctor = await Doctor.findOne({ 
        where: {
          demail: req.body.demail,
          id: { [Op.ne]: req.params.id },
        },
        transaction,
      });
      if (existingDoctor) {
        await transaction.rollback();
        return res.status(409).json({
          message: "Doctor email already exists",
          error: "DUPLICATE_DOCTOR_EMAIL",
        });
      }
    }
    await doctor.update(req.body, { transaction });
    const user = await User.findOne({
      where: { doctor_id: doctor.id },
      transaction,
    });
    if (user) {
      const moduleValues = cleanArray([req.body.assign_ddpt, req.body.ddpt]);

      const userUpdates = {
        first_name: req.body.dname,
        email: req.body.demail,
        dob: req.body.ddob,
        username: req.body.demail,
        password: req.body.ddob,
        module: [doctor.assign_ddpt, doctor.ddpt].filter(Boolean),
        hospitalid: req.body.hospitalid,
        nodalid: req.body.nodalid,
        module: moduleValues.length > 0 ? moduleValues : null,
      };
      await user.update(userUpdates, { transaction });
    }

    await transaction.commit();
    res.status(200).json({ message: "Doctor updated successfully" });
  } catch (e) {
    await transaction.rollback();
    res.status(400).json({ message: `Something went wrong ${e}` });
  }
};

// 5. Update Doctor Status (active/pending)
const updateDoctorStatus = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // Find the doctor by ID
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res
        .status(404)
        .json({ message: `Doctor not found for this id ${req.params.id}` });
    }
    // Validate and update status
    const { hospitalid, nodalid, dstatus, assign_ddpt } = req.body;
    if (req.body.dstatus) {
      if (!["active", "pending", "rejected"].includes(dstatus)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
    }

    await doctor.update(
      { hospitalid, nodalid, dstatus, assign_ddpt },
      { transaction }
    );
    await transaction.commit();
    res.status(200).json({ message: "Doctor status updated successfully" });
  } catch (e) {
    await transaction.rollback();
    res.status(400).json({ message: `Something went wrong ${e}` });
  }
};

// 6. Search Doctor By Name or Qualification
const searchDoctor = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query cannot be empty" });
    }

    const doctors = await Doctor.findAll({
      where: {
        [Op.or]: [
          { dname: { [Op.iLike]: `${query}%` } },
          { dspclty: { [Op.contains]: [query] } },
          { ddpt: { [Op.iLike]: `${query}%` } },
        ],
      },
      include:[
         {
          model: Hospital,
          as: "hospital",
          attributes: ["hospitalname"],
        },
        {
          model: Nodal,
          as: "nodal",
          attributes: ["nodalname"],
        },
      ],
      order: [["dname", "ASC"]],
       limit: 50,
    });
    if (doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found" });
    }
    res.status(200).json(doctors);
  } catch (error) {
    res.status(400).json({ message: `Something went wrong ${error}` });
  }
};


module.exports = {
  addDoctor,
  getDoctor,
  getDoctorById,
  updateDoctor,
  updateDoctorStatus,
  searchDoctor,
};
