const sequelize = require("../../../db/connectDB");
const Role = require("../../../model/adminModel/masterModel/roletypeMaster");

// 1.Add Role Type
const addRole = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    //check role already exists
    const { roletype } = req.body;
    const checkrole = await Role.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("roletype")),
        roletype.toLowerCase()
      ),
      transaction,
    });
    if (checkrole) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Role with this name already exists",
        error: "DUPLICATE_ROLE_NAME",
      });
    }

    await Role.create(req.body, { transaction });
    await transaction.commit();
    res.status(201).json({
      message: "Role create successfully",
    });
  } catch (e) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${e}` });
  }
};

// 2.Get All Role

const getRole = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const { count, rows } = await Role.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["id", "ASC"]],
    });

    const totalPages = Math.ceil(count / limit);

    if (!rows) {
      return res.status(404).json({ message: "No role found" });
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
  } catch (e) {
    res.status(400).send({ message: `Something went wrong ${e}` });
  }
};

// 3. Get Role By Id

const getRoleById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      return res.status(200).json({ message: "Role not found" });
    }
    res.status(200).json(role);
  } catch (e) {
    res.status(400).send({ message: `Something went wrong ${e}` });
  }
};

//4.  Update Role

const updateRole = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const update_role = await Role.findByPk(req.params.id);
    if (!update_role) {
      return res.status(200).json({ message: "Role not found" });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Updated data not provided" });
    }

    await update_role.update(req.body, {
      transaction,
    });
    await transaction.commit();
    res.status(200).json({
      message: "Role updated successfully",
    });
  } catch (e) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${e}` });
  }
};

module.exports = { addRole, getRole, getRoleById, updateRole };
