const OutLab = require("../../../model/adminModel/masterModel/outsourceMaster");
const Investigation = require("../../../model/adminModel/masterModel/investigation");
const sequelize = require("../../../db/connectDB");
const { Op } = require("sequelize");

// 1. Add OutLab
const addOutLab = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { labname } = req.body;

    // Check if lab with the same name already exists
    const existingLab = await OutLab.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("labname")),
        labname.toLowerCase()
      ),
    });
    if (existingLab) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Lab with this name already exists",
        error: "DUPLICATE_LAB_NAME",
      });
    }
    await OutLab.create(req.body, { transaction });

    await transaction.commit();
    res.status(201).json({ message: "Lab created successfully" });
  } catch (error) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 2. Get Lab to Lab
const getOutLab = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const { count, rows } = await OutLab.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["id", "ASC"]],
    });

    const totalpage = Math.ceil(count / limit);

    if (!rows) {
      return res.status(404).json({ message: "No data found" });
    }
      // 1. Get all unique IDs from all labs on this page
    const allInvIds = [...new Set(rows.flatMap(lab => lab.investigationids || []))];

    // 2. Fetch only ID, Name, and Price for those IDs
    const allTests = await Investigation.findAll({
      where: { id: { [Op.in]: allInvIds } },
      attributes: ["id", "testname", "normalprice"],
    });

    // 3. Attach the test details to each lab
    const finalData = rows.map(lab => {
      const labJson = lab.toJSON();
      labJson.Investigations = allTests.filter(t => 
        lab.investigationids?.includes(t.id)
      );
      return labJson;
    });

    res.status(200).json({
      data: finalData,
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
const getOutLabById = async (req, res) => {
  try {
    const lab = await OutLab.findByPk(req.params.id);
    if (!lab) {
      return res
        .status(200)
        .json({ message: `No lab found for this id ${req.params.id}` });
    }
    // 2. Fetch the actual investigation details from the Investigation table
    // We use the array stored in the OutLab table to find them
    let tests = [];
    if (lab.investigationids && lab.investigationids.length > 0) {
      tests = await Investigation.findAll({
        where: {
          id: { [Op.in]: lab.investigationids },
        },
        attributes: ["id", "testname", "normalprice"],
      });
    }
    return res.status(200).json({
      ...lab.toJSON(),
      investigations: tests,
    });
  } catch (error) {
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 4. Update Lab
const updateOutLab = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const updatelab = await OutLab.findByPk(req.params.id);
    if (!updatelab) {
      await transaction.rollback();
      return res.status(404).json({ message: "Lab not found" });
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

module.exports = { addOutLab, getOutLab, getOutLabById, updateOutLab };
