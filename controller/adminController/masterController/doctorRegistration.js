const sequelize = require("../../../db/connectDB");
const Doctor = require("../../../model/adminModel/masterModel/doctorRegistration");

// 1. Add Doctor
const addDoctor = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { dname } = req.body;
    const existingDoctor = await Doctor.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("dname")),
        dname.toLowerCase()
      ),
      transaction,
    });
    if (existingDoctor) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Doctor with this name already exists",
        error: "DUPLICATE_DOCTOR_NAME",
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
    let page = Number(req.params.page) || 1;
    let limit = Number(req.params.limit) || 10;
    let offset = (page - 1) * limit;

    const { count, rows } = await Doctor.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["id", "ASC"]],
    });

    const totalpages = Math.ceil(count / limit);

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
    const get_by_id = await Doctor.findByPk(req.params.id);
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
    if (!doctor) {
      return res
        .status(200)
        .json({ message: `Department not found for this id ${req.params.id}` });
    }
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Update data not provide" });
    }
    await doctor.update(req.body, { transaction });
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
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res
        .status(200)
        .json({ message: `Doctor not found for this id ${req.params.id}` });
    }
    const { dstatus } = req.body;
    if (!dstatus || (dstatus !== "active" && dstatus !== "pending")) {
      return res.status(400).json({
        message: "Invalid status value. Allowed values are 'active' or 'pending'",
      });
    }
    await doctor.update({ dstatus }, { transaction });
    await transaction.commit();
    res.status(200).json({ message: "Doctor status updated successfully" });
  } catch (e) {
    await transaction.rollback();
    res.status(400).json({ message: `Something went wrong ${e}` });
  }
};

module.exports = {
  addDoctor,
  getDoctor,
  getDoctorById,
  updateDoctor,
  updateDoctorStatus,
};
