const {NodalInstrument,Nodal,Instrument}=require('../../../model/associatemodels/associatemodel');
const sequelize = require("../../../db/connectDB");

// 1. Add Nodal Instrument
const addNodalInstrument=async(req,res)=>{
    const transaction = await sequelize.transaction();
  try {
    const { nodalid, instrumentId } = req.body;

    // Check that Nodal actually exists
    const nodalExists = await Nodal.findByPk(nodalid, {
      transaction,
    });
    if (!nodalExists) {
      await transaction.rollback();
      return res.status(404).json({ message: "Parent nodal not found." });
    }

    // Check that Instrument actually exists
    const instrumentExists = await Instrument.findByPk(instrumentId, {
      transaction,
    });
    if (!instrumentExists) {
      await transaction.rollback();
      return res.status(404).json({ message: "Parent instrument not found." });
    }

    // Check for existing relationship (prevent duplicates)
    const existingRelation = await NodalInstrument.findOne({
      where: {
        nodalid: nodalid,
        instrumentId: instrumentId
      },
      transaction,
    });

    if (existingRelation) {
      await transaction.rollback();
      return res.status(409).json({
        message: "This nodal-instrument  already exists",
        error: "DUPLICATE_NODAL_INSTRUMENT",
      });
    }

    await NodalInstrument.create(req.body, {
      transaction,
    });
    await transaction.commit();
    res.status(201).json({ message: "Nodal instrument created successfully" });
  } catch (error) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 2. Get Nodal Instrument

const getNodalInstrument = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const { count, rows } = await NodalInstrument.findAndCountAll({
      include: [
        {
          model: Nodal,
          as: "nodal",
          attributes: ["nodalname"],
        },
        {
          model: Instrument,
          as: "instrument",
          attributes: ["instrumentname"],
        },
      ],
      limit: limit,
      offset: offset,
      order:[['id','ASC']]
    });

    const totalPages = Math.ceil(count / limit);

    if (!rows) {
      return res.status(200).json({ message: "No records found" });
    }

    const formattedData = rows.map((record) => ({
      id: record.id,
      nodalName: record.nodal?.nodalname,
      instrumentName: record.instrument?.instrumentname,
      isactive: record.isactive,
    }));
    res.status(200).json({
      data: formattedData,
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

// 3. Get Nodal Instrument By Id
const getNodalInstrumentById = async (req, res) => {
  try {
    const findNodal = await NodalInstrument.findByPk(req.params.id, {
      include: [
        {
          model: Nodal,
          as: "nodal",
          attributes: ["id","nodalname"],
        },
        {
          model: Instrument,
          as: "instrument",
          attributes: ["id","instrumentname"],
        },
      ],
    });

    if (!findNodal) {
      return res.status(404).json({ message: "Nodal Instrument not found" });
    }

    const formattedData = {
      nodalid:findNodal.nodal?.id,
      nodalName: findNodal.nodal?.nodalname,
      instrumentid:findNodal.instrument?.id,
      instrumentName: findNodal.instrument?.instrumentname,
      isactive: findNodal.isactive,
    };
    return res.status(200).json(formattedData);
  } catch (e) {
    res.status(400).json({ message: `Something went wrong ${e}` });
  }
};




// 4. Update Nodal Instrument
const updateNodalInstrument = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
      const { nodalid, instrumentid, isactive } = req.body;
    const updatenodal = await NodalInstrument.findByPk(req.params.id,{transaction});
    if (!updatenodal) {
      await transaction.rollback();
      return res
        .status(200)
        .json({ message: "Nodal Instrument record not found" });
    }

    if (Object.keys(req.body).length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "Updated data not provided" });
    }

        // Check that Nodal actually exists
   if (nodalid) {
      const nodalExists = await Nodal.findByPk(nodalid, {
        transaction,
      });
      if (!nodalExists) {
        await transaction.rollback();
        return res.status(404).json({ message: "Parent nodal not found." });
      }
    }

    // Check that Instrument actually exists
    if (instrumentid) {
      const instrumentExists = await Instrument.findByPk(instrumentid, {
        transaction,
      });
      if (!instrumentExists) {
        await transaction.rollback();
        return res.status(404).json({ message: "Parent instrument not found." });
      }
    }
    
    await updatenodal.update(req.body, { transaction });
    await transaction.commit();
    res.status(200).json({
      message: "Attached nodal update sucessfully",
    });
  } catch (e) {
    await transaction.rollback();
    res.status(400).json({ message: `Something went wrong ${e}` });
  }
};

module.exports = { addNodalInstrument, getNodalInstrument,getNodalInstrumentById, updateNodalInstrument };
   

