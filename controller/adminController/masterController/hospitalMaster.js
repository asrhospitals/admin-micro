const Hospital = require("../../../model/adminModel/masterModel/hospitalMaster");
const sequelize = require("../../../db/connectDB");
const HospipatlType = require("../../../model/adminModel/masterModel/hospitalTypeMaster");

// 1. Add Hospital
const addhospital = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { hospitalname, hospital_type_id } = req.body;

    // Check that department actually exists
    const checkHospitalType = await HospipatlType.findByPk(hospital_type_id, {
      transaction,
    });
    if (!checkHospitalType) {
      await transaction.rollback();
      return res.status(404).json({ message: "Parent hospital type not found." });
    }

    const existingHospital = await Hospital.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("hospitalname")),
        hospitalname.toLowerCase()
      ),
      transaction,
    });

    if (existingHospital) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Hospital with this name already exists",
        error: "DUPLICATE_HOSPITAL_NAME",
      });
    }

    await Hospital.create(req.body, {
      transaction,
    });
    await transaction.commit();
    res.status(201).json({ message: "Hospital created successfully" });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ message: `Something went wrong ${error}` });
  }
};

// 2. Get Hospital
const gethospital = async (req, res) => {
  try {
    //Add pagination
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const { count, rows } = await Hospital.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["id", "ASC"]],
      include: [
        { model: HospipatlType, as: "hospitalType", attributes: ["hsptltype"] },
      ],
    });

    // count total pages
    const totalPages = Math.ceil(count / limit);

    // Check if there are no rows
    if (!rows) {
      return res.status(200).json({ message: "No hospital found" });
    }

    // Return Response
    res.status(200).json({
      data: rows,
      meta: {
        totalItems: count,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    res.status(400).json({ message: `Something went wrong ${error}` });
  }
};

// 3. Get Hospital By Id

const getHospitalById = async (req, res) => {
  try {
    const get_hospital = await Hospital.findByPk(req.params.id);
    if (!get_hospital) {
      return res.status(200).json({
        message: `Not found any hospital for this id ${req.params.id}`,
      });
    }
    res.status(200).json(get_hospital);
  } catch (error) {
    res.status(400).json({ message: `Something went wrong ${error}` });
  }
};

// 4. Update Hospital
const updatehospital = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const update_hospital = await Hospital.findByPk(req.params.id);
    if (!update_hospital) {
      return res.status(200).json({
        message: `Not found any hospital for this id ${req.params.id}`,
      });
    }
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Updated data not provided" });
    }
    await update_hospital.update(req.body, { transaction });
    await transaction.commit();
    res.status(200).json({ message: "Hospital update successfully" });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ message: `Something went wrong ${error}` });
  }
};

// 5. Get All Hospitals
const getAllHospitals = async (req, res) => {
  try {
    const getAllHospital = await Hospital.findAll({
      order: [["id", "ASC"]],
    });
    res.status(200).json(getAllHospital);
  } catch (error) {
    res.status(400).json({ message: `Something went wrong ${error}` });
  }
};

module.exports = { addhospital, gethospital, getHospitalById, updatehospital,getAllHospitals };
