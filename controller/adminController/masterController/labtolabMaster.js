const sequelize = require("../../../db/connectDB");
const LabtoLab = require("../../../model/adminModel/masterModel/labtolabMaster");

// 1. Add LabtoLab
const addlabtolab = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const newLab = req.body;
    await LabtoLab.create(newLab, { transaction });
    await transaction.commit();
    res.status(201).json({ message: "Lab created successfully" });
  } catch (error) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 2. Get Lab to Lab
const getlabtolab = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const { count, rows } = await LabtoLab.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["labname", "ASC"]],
    });

    const totalpage = Math.ceil(count / limit);

    if (!rows) {
      return res.status(200).json({ message: "No data found" });
    }

    res.status(200).json({
      data: rows,
      meta: {
        totalItems: count,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: totalpage,
      },
    });
  } catch (error) {
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 3. Get Lab By Id
const getLabById = async (req, res) => {
  try {
    const get_by_id = await LabtoLab.findByPk(req.params.id);
    if (!get_by_id) {
      return res
        .status(200)
        .json({ message: `No lab found for this id ${req.params.id}` });
    }
    res.status(200).json(get_by_id);
  } catch (error) {
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 4. Update Lab
const updatelabtolab = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const updatelab = await LabtoLab.findByPk(req.params.id);
    if (!updatelab) {
      await transaction.rollback();
      return res.status(200).json({ message: "Lab not found" });
    }

    if (Object.keys(req.body).length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "Updated data not provided" });
    }
    await updatelab.update(req.body, { transaction });
    await transaction.commit();
    res.status(200).json({ message: "Lab update successfully" });
  } catch (error) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

module.exports = { addlabtolab, getlabtolab,getLabById, updatelabtolab };
