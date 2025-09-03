const Speciman = require("../../../model/adminModel/masterModel/specimenTypeMaster");
const sequalize = require("../../../db/connectDB");

// 1. Add Speciman
const addSpecimen = async (req, res) => {
  const transaction = await sequalize.transaction();
  try {
    const { specimenname, specimendes, isactive } = req.body;
    const existingSpecimen = await Speciman.findOne({
      where: { specimenname },
      transaction,
    });

    if (existingSpecimen) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Specimen with this name already exists",
        error: "DUPLICATE_SPECIMEN_NAME",
      });
    }
    await Speciman.create(req.body, { transaction });
    await transaction.commit();
    res.status(201).json({ message: "Specimen created successfully" });
  } catch (error) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 2. Get Specimen
const getSpecimen = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const { count, rows } = await Speciman.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["id", "ASC"]],
    });

    const totalpages = Math.ceil(count / limit);

    if (!rows) {
      return res.status(404).json({ message: "No data found" });
    }

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

// 3. Get Specimen By Id
const getSpecimenById = async (req, res) => {
  try {
    const get_by_id = await Speciman.findByPk(req.params.id);
    if (!get_by_id) {
      return res
        .status(404)
        .json({ message: `No data found for this id ${req.params.id}` });
    }
    res.status(200).json(get_by_id);
  } catch (error) {
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 4. Update Specimen
const updateSpecimen = async (req, res) => {
  const transaction = await sequalize.transaction();
  try {
    const updateSpecimens = await Speciman.findByPk(req.params.id);
    if (!updateSpecimens) {
      return res.status(404).json({ message: " Specimen not found" });
    }
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Updated data not provided" });
    }

    await updateSpecimens.update(req.body, { transaction });
    await transaction.commit();
    res.status(200).json({message:"Specimen update successfully"});
  } catch (error) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

module.exports = { addSpecimen, getSpecimen, getSpecimenById, updateSpecimen };
