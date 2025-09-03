const {
  Subdepartment,
  Department,
} = require("../../../model/associatemodels/associatemodel");
const sequelize = require("../../../db/connectDB");

// 1. Add Sub Department
const addSubDepartment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { subdptname, department_id, isactive } = req.body;

    // Check that department actually exists
    const departmentExists = await Department.findByPk(department_id, {
      transaction,
    });
    if (!departmentExists) {
      await transaction.rollback();
      return res.status(404).json({ message: "Parent department not found." });
    }

    const existingSubDpt = await Subdepartment.findOne({
      where: { subdptname },
      transaction,
    });

    if (existingSubDpt) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Sub Department with this name already exists",
        error: "DUPLICATE_SUBDEPARTMENT_NAME",
      });
    }

    await Subdepartment.create(req.body, {
      transaction,
    });
    await transaction.commit();
    res.status(201).json({ message: "Sub Department created successfully" });
  } catch (e) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${e}` });
  }
};

// 2.Get All SubDepartment

const getSubDepartment = async (req, res) => {
  try {
    // Add Pagination
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    // Find By limit and Count all
    const { count, rows } = await Subdepartment.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["subdptname", "ASC"]],
      include: [
        {
          model: Department,
          as: "department",
          attributes: ["dptname"],
        },
      ],
    });

    // calculate total Pages

    const totalPages = Math.ceil(count / limit);

    // If there is no data
    if (!rows) {
      return res.status(200).json({ message: "No Sub Department found" });
    }

    // Return the reponse
    res.status(200).json({
      data: rows,
      meta: {
        totalItems: count,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: totalPages,
      },
    });
  } catch (e) {
    res.status(400).send({ message: `Something went wrong ${e}` });
  }
};

// 3. Get Subdepartment By Id

const getById = async (req, res) => {
  try {
    const get_id = await Subdepartment.findByPk(req.params.id);
    if (!get_id) {
      return res.status(200).json({ message: "Parent id not found" });
    }
    res.status(200).json(get_id);
  } catch (e) {
    res.status(400).send({ message: `Something went wrong ${e}` });
  }
};

// 4. Update Department
const updateSubDepartment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const updateSub = await Subdepartment.findByPk(req.params.id);
    if (!updateSub) {
      return res.status(200).json({ message: "Subdepartment not found" });
    }
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Updated data not provided" });
    }
    await updateSub.update(req.body, { transaction });
    await transaction.commit();
    res.status(200).json({
      message: "Subdepartment updated successfully",
    });
  } catch (error) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${e}` });
  }
};

module.exports = {
  addSubDepartment,
  getSubDepartment,
  getById,
  updateSubDepartment,
};
