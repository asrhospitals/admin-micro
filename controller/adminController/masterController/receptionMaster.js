const sequelize = require("../../../db/connectDB");
const Reception = require("../../../model/adminModel/masterModel/receptionMaster");

// 1. Add Receptionist
const addReception = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { receptionistname } = req.body;
    const existingReceptionist = await Reception.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("receptionistname")),
        receptionistname.toLowerCase()
      ),
      transaction,
    });
    if (existingReceptionist) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Receptionist with this name already exists",
        error: "DUPLICATE_RECEPTIONIST_NAME",
      });
    }

    await Reception.create(req.body, {
      transaction,
    });
    await transaction.commit();
    res.status(201).json({
      message: "Receptionist created successfully",
    });
  } catch (e) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${e}` });
  }
};

// 2. Get Reception

const getReception = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let offset = (page - 1) * limit;
    const { count, rows } = await Reception.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["id", "ASC"]],
    });

    if (!rows) {
      return res.status(200).json({ message: "No data found" });
    }

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
  } catch (error) {
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 3. Get Reception By Id
const getReceptionById = async (req, res) => {
  try {
    const get_by_id = await Reception.findByPk(req.params.id);
    if (!get_by_id) {
      return res
        .status(400)
        .json({ message: `No data found for this id ${req.params.id}` });
    }
    res.status(200).json(get_by_id);
  } catch (error) {
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 4. Update Reception
const updateReception = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const updaterecep = await Reception.findByPk(req.params.id);

    if (!updaterecep) {
      return res.status(404).json({ message: `Id ${req.params.id} not found` });
    }

    if (Object.keys(req.body).length === 0) {
      await t.rollback();
      return res.status(200).json({ message: "No data provide" });
    }
    await updaterecep.update(req.body, { t });
    await t.commit();
    res.status(200).json({ message: "Reception update successfully" });
  } catch (error) {
    await t.rollback();
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

module.exports = {
  addReception,
  getReception,
  getReceptionById,
  updateReception,
};
