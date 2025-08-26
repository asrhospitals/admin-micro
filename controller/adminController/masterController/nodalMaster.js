const sequelize = require("../../../db/connectDB");
const Nodal = require("../../../model/adminModel/masterModel/nodalMaster");

// 1. Add Nodal
const addNodal = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const add_nodal = req.body;
    const create_nodal = await Nodal.create(add_nodal, { transaction });
    await transaction.commit();
    res.status(201).json(create_nodal);
  } catch (error) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 2. Get Nodal
const getNodal = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const { count, rows } = await Nodal.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["nodalname", "ASC"]],
    });

    const totalPages = Math.ceil(count / limit);

    if (!rows) {
      return res.status(200).json({ message: "No nodal available" });
    }

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
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 3. Get Nodal By Id
const getNodalById = async (req, res) => {
  try {
    const get_nodal_id = await Nodal.findByPk(req.params.id);
    if (!get_nodal_id) {
      return res
        .status(200)
        .json({ message: `Not found any nodal for this id ${req.params.id}` });
    }
    res.status(200).json(get_nodal_id);
  } catch (error) {
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 4. Update Nodal
const updateNodal = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const updatenodal = await Nodal.findByPk(req.params.id);
    if (!updatenodal) {
      return res
        .status(200)
        .json({ message: `Not found any nodal for this id ${req.params.id}` });
    }
    
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Updated data not provided" });
    }

    await updatenodal.update(req.body, { transaction });
    await transaction.commit();
    res.status(200).json({ message: "Nodal update successfully" });
  } catch (error) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

module.exports = { addNodal, getNodal, getNodalById, updateNodal };
