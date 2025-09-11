const Instrument = require("../../../model/adminModel/masterModel/instrumentMaster");
const sequelize = require("../../../db/connectDB");

// 1. Add Instrument
const addInstrument = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    //check instrument already exists
    const { instrumentname } = req.body;
    const checkinstrument = await Instrument.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("instrumentname")),
        instrumentname.toLowerCase()
      ),
      transaction,
    });
    if (checkinstrument) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Instrument with this name already exists",
        error: "DUPLICATE_INSTRUMENT_NAME",
      });
    }

    await Instrument.create(req.body, { transaction });
    await transaction.commit();
    res.status(201).json({
      message: "Instrument create successfully",
    });
  } catch (err) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${err}` });
  }
};

// 2. Get Instrument
const getInstrument = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const { count, rows } = await Instrument.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["id", "ASC"]],
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
  } catch (e) {
    res.status(400).send({ message: `Something went wrong ${e}` });
  }
};

// 3. Get Instrument By Id

const getInstrumentById = async (req, res) => {
  try {
    const get_by_id = await Instrument.findByPk(req.params.id);
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

// 4. Update Instrument
const updateInstrument = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const updateinstrument = await Instrument.findByPk(req.params.id);
    if (!updateinstrument) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: `No data found for this id ${req.params.id}` });
    }
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Updated data not provided" });
    }
    await updateinstrument.update(req.body, { transaction });
    await transaction.commit();
    res.status(200).json({ message: "Instrument updated successfully" });
  } catch (error) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

module.exports = {
  addInstrument,
  getInstrument,
  getInstrumentById,
  updateInstrument,
};
