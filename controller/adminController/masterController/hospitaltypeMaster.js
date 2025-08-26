const HospipatlType = require("../../../model/adminModel/masterModel/hospitalTypeMaster");
const sequelize = require("../../../db/connectDB");

// 1. Add Hospital Type
const addhsptltype = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const add_hospital = req.body;
    const addhsptltype = await HospipatlType.create(add_hospital, {
      transaction,
    });
    await transaction.commit();
    res.status(201).json({
      message: "Hospital type created successfully",
      data: addhsptltype,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 2. Get Hospital Type

const gethsptltype = async (req, res) => {
  try {
    // Add Pagination
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await HospipatlType.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["hsptltype", "ASC"]],
    });

    // Count Total Page
    const totalpages = Math.ceil(count / limit);

    // Check if there are no rows
    if (!rows) {
      return res.status(404).json({ message: "No hospital types found" });
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
  } catch (error) {
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 3. Get By Id

const getHospitalTypeById = async (req, res) => {
  try {
    const get_by_id = await HospipatlType.findByPk(req.params.id);
    if (!get_by_id) {
      return res.status(200).json({ message: "No hsopital type found" });
    }
    res.status(200).json(get_by_id);
  } catch (error) {
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 4. Update Hospital Type

const updatehsptltype = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const updateHospitalType = await HospipatlType.findByPk(req.params.id);
    if (!updateHospitalType) {
      return res
        .status(400)
        .json({ message: `No hospital type found by this id ${req.params.id}` });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Updated data not provided" });
    }
      await updateHospitalType.update(req.body);
      await transaction.commit();
      res.status(200).json(updateHospitalType);
    }
   catch (error) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

module.exports = {
  addhsptltype,
  gethsptltype,
  getHospitalTypeById,
  updatehsptltype,
};
