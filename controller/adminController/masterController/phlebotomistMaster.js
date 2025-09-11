const sequelize = require("../../../db/connectDB");
const Phlebotomist = require("../../../model/adminModel/masterModel/phlebotomistMaster");

// 1. Add New Phlebotomist
const addPhlebo = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { phleboname } = req.body;

    // Check Phlebo Already exist
    const existingPhlebo = await Phlebotomist.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("phleboname")),
        phleboname.toLowerCase()
      ),
      transaction,
    });
    if (existingPhlebo) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Phlebo with this name already exists",
        error: "DUPLICATE_PHLEBO_NAME",
      });
    }
    await Phlebotomist.create(req.body, { transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 2. Get Phlebotomist

const getPhlebo = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let offset = (page - 1) * limit;
    const { count, rows } = await Phlebotomist.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["id", "ASC"]],
    });
    if (!rows) {
      return res.status(200).json({ message: "No data available" });
    }
    const totalpages = Math.ceil(count / limit);
    res.status(200).json({
      data: rows,
      meta: {
        totalitems: count,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: totalpages,
      },
    });
  } catch (error) {
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 3. Get Phlebo By Id
const getPhleboById = async (req, res) => {
  try {
    const get_by_id = await Phlebotomist.findByPk(req.params.id);
    if (!get_by_id) {
      return res
        .status(200)
        .json({ message: `No data found for this id ${req.params.id}` });
    }
    res.status(200).json(get_by_id);
  } catch (error) {
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 4. Update Phlebo
const updatePhlebo = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const update_phlebo = await Phlebotomist.findByPk(req.params.id);
    if (!update_phlebo) {
      return res.status(200).json({ message: "Phlebotomist not found" });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Updated data not provided" });
    }

    await update_phlebo.update(req.body, {
      transaction,
    });
    await transaction.commit();
    res.status(200).json({
      message: "Phlebotomist updated successfully",
    });
  } catch (e) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${e}` });
  }
};

module.exports = { addPhlebo, getPhlebo, getPhleboById, updatePhlebo };
