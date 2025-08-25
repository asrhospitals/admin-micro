const Department = require("../../../model/adminModel/masterModel/departmentMaster");
const sequelize = require("../../../db/connectDB");

// 1. Create Department
const addDepartment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const add_department = req.body;
    const create_department = await Deparment.create(add_department, {
      transaction,
    });
    await transaction.commit();
    res.status(201).json({
      message: "Department added successfully",
      data: create_department,
    });
  } catch (e) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${e}` });
  }
};

// 2. Get All Department
const getDepartment = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const { count,rows } = await Department.findAndCountAll({
      limit: limit,
      offset: offset,
      order:[['dptname','ASC']]
    });

    const totalPages = Math.ceil(count/limit);

    if (!rows) {
      return res.status(404).json({ message: "No department found" });
    }
    res.status(200).json({
      data: rows,
      meta: {
        totalItems: count,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: totalPages
      },
    });
  } catch (e) {
    res.status(400).send({ message: `Something went wrong ${e}` });
  }
};

// 3. Get Department By Id
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(200).json({ message: "Department not found" });
    }
    res.status(200).json(department);
  } catch (e) {
    res.status(400).send({ message: `Something went wrong ${e}` });
  }
};

// 4.Update Department
const updateDepartment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const updateDepartment = await Department.findByPk(req.params.id);
    if (!updateDepartment) {
      return res.status(200).json({ message: "Department not found" });
    }
    await updateDepartment.update(req.body, {
      transaction,
    });
    await transaction.commit();
    res.status(200).json({
      message: "Department updated successfully",
    });
  } catch (e) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${e}` });
  }
};

module.exports = {
  addDepartment,
  getDepartment,
  getDepartmentById,
  updateDepartment,
};
