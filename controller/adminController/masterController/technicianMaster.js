const sequelize = require("../../../db/connectDB");
const Technician = require("../../../model/adminModel/masterModel/technicianMaster");

// 1. Add Technician
const addTechnician = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const add_technician = req.body;
    const create_technician = await Technician.create(add_technician, {
      transaction,
    });
    await transaction.commit();
    res.status(201).json(create_technician);
  } catch (error) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 2. Get Technician

const getTechnician = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Technician.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["technicianname", "ASC"]],
    });

    const totalPages = Math.ceil(count / limit);

        if (!rows) {
      return res.status(404).json({ message: "No technician found" });
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

// 3. Get Technician By Id

const getTechnicianById = async (req, res) => {
  try {
    const get_tech = await Technician.findByPk(req.params.id);
    if (!get_tech) {
      return res
        .status(404)
        .json({ message: `Technician not found for this ${req.params.id}` });
    }
    res.status(200).json(get_tech);
  } catch (error) {
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 4. Update Technician
const updateTechnician = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const update_tech = await Technician.findByPk(req.params.id);
    if (!update_tech) {
      return res
        .status(404)
        .json({ message: `Technician not found for this id ${req.params.id}` });
    }
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Updated data not provided" });
    }
    await update_tech.update(req.body, { transaction });
    await transaction.commit();
    res.status(200).json({ message: "Technician updated successfully" });
  } catch (error) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

module.exports = {
  addTechnician,
  getTechnician,
  getTechnicianById,
  updateTechnician,
};
