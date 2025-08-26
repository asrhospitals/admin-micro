const sequelize = require("../../../db/connectDB");
const Phlebotomist = require("../../../model/adminModel/masterModel/phlebotomistMaster");

// 1. Add New Phlebotomist
const addPhlebo = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const newPhlebo = req.body;
    const createPhlebo = await Phlebotomist.create(newPhlebo, { t });
    await t.commit();
    res.status(201).json(createPhlebo);
  } catch (error) {
    await t.rollback();
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 2. Get Phlebotomist

const getPhlebo = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.page) || 10;
    let offset = (page - 1) * limit;
    const { count, rows } = await Phlebotomist.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["phleboname", "ASC"]],
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
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const update_phlebo = await Phlebotomist.findByPk(id);
    if (!update_phlebo) {
      return res
        .status(404)
        .json({ message: `No data found for this id ${id}` });
    }
    if (Object.keys(req.body).length === 0) {
      return res.status(404).json({ message: "Updated data not provided" });
    }

    await update_phlebo.update(req.body, { t });
    await t.commit();
    res.status(200).json({ message: "Phlebotomist update successfully" });
  } catch (error) {
    await t.rollback();
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

module.exports = { addPhlebo, getPhlebo, getPhleboById, updatePhlebo };
