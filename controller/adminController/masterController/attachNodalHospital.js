const sequelize = require("../../../db/connectDB");
const {
  Nodal,
  Hospital,
  NodalHospital,
} = require("../../../model/associatemodels/associatemodel");

// 1. Add Nodal
const addNodalHospital = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { nodalid, hospitalid, isactive } = req.body;

    // Check that Nodal actually exists
    const nodalExists = await Nodal.findByPk(nodalid, {
      transaction,
    });
    if (!nodalExists) {
      await transaction.rollback();
      return res.status(404).json({ message: "Parent nodal not found." });
    }

    // Check that Hospital actually exists
    const hospitalExists = await Hospital.findByPk(hospitalid, {
      transaction,
    });
    if (!hospitalExists) {
      await transaction.rollback();
      return res.status(404).json({ message: "Parent hospital not found." });
    }

    // Check for existing relationship (prevent duplicates)
    const existingRelation = await NodalHospital.findOne({
      where: {
        nodalid: nodalid,
        hospitalid: hospitalid,
      },
      transaction,
    });

    if (existingRelation) {
      await transaction.rollback();
      return res.status(409).json({
        message: "This nodal-hospital  already exists",
        error: "DUPLICATE_NODAL_HOSPITAL",
      });
    }

    await NodalHospital.create(req.body, {
      transaction,
    });
    await transaction.commit();
    res.status(201).json({ message: "Nodal hospital created successfully" });
  } catch (error) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 2. Get Nodal
const getNodalHospital = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const { count, rows } = await NodalHospital.findAndCountAll({
      include: [
        {
          model: Nodal,
          as: "nodal",
          attributes: ["nodalname"],
        },
        {
          model: Hospital,
          as: "hospital",
          attributes: ["hospitalname"],
        },
      ],
      limit: limit,
      offset: offset,
    });

    const totalPages = Math.ceil(count / limit);

    if (!rows) {
      return res.status(200).json({ message: "No records found" });
    }

    const formattedData = rows.map((record) => ({
      id: record.id,
      nodalName: record.nodal?.nodalname,
      hospitalName: record.hospital?.hospitalname,
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

// 3. Get Attached Nodal Hospital By Id
const getNodalHospitalById = async (req, res) => {
  try {
    const findNodal = await NodalHospital.findByPk(req.params.id, {
      include: [
        {
          model: Nodal,
          as: "nodal",
          attributes: ["nodalname"],
        },
        {
          model: Hospital,
          as: "hospital",
          attributes: ["hospitalname"],
        },
      ],
    });

    if (!findNodal) {
      return res.status(404).json({ message: "Nodal Hospital not found" });
    }

    const formattedData = {
      nodalName: findNodal.nodal?.nodalname,
      hospitalName: findNodal.hospital?.hospitalname,
      isactive: findNodal.isactive,
    };
    return res.status(200).json(formattedData);
  } catch (e) {
    res.status(400).json({ message: `Something went wrong ${e}` });
  }
};

// 4. Update Attach Nodal
const updateNodalHospital = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { nodalid, hospitalid, isactive } = req.body;
    const updatenodal = await NodalHospital.findByPk(req.params.id, {
      transaction,
    });
    if (!updatenodal) {
      await transaction.rollback();
      return res
        .status(200)
        .json({ message: "Nodal Hospital record not found" });
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

    // Check that Hospital actually exists
    if (hospitalid) {
      const hospitalExists = await Hospital.findByPk(hospitalid, {
        transaction,
      });
      if (!hospitalExists) {
        await transaction.rollback();
        return res.status(404).json({ message: "Parent hospital not found." });
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

// 5. Get All Nodal Hospitals
const getAllNodalHospitals = async (req, res) => {
  try {
    const nodalHospitals = await NodalHospital.findAll({
      include: [
        {
          model: Nodal,
          as: "nodal",
          attributes: ["nodalname", "id"],
        },
        {
          model: Hospital,
          as: "hospital",
          attributes: ["hospitalname", "id"],
        },
      ],
    });

    if (!nodalHospitals || nodalHospitals.length === 0) {
      return res.status(404).json({ message: "No Nodal Hospitals found" });
    }

    const formattedData = nodalHospitals.map((record) => ({
      id: record.id,
      nodalid: record.nodal?.id,
      nodalname: record.nodal?.nodalname,
      hospitalid: record.hospital?.id,
      hospitalname: record.hospital?.hospitalname,
      isactive: record.isactive,
    }));

    return res.status(200).json(formattedData);
  } catch (e) {
    return res.status(400).json({ message: `Something went wrong ${e}` });
  }
};

// 6. Get Hospital By Nodal

const getHospitalByNodal = async (req, res) => {
  try {
    const { id } = req.params;
    const nodalExists = await Nodal.findByPk(id);
    if (!nodalExists) {
      return res.status(404).json({ message: "Nodal not found" });
    }
    const getHospital = await NodalHospital.findAll({
      where: {
        nodalid: id,
      },
      attributes:[],
      include:[
      {  model:Hospital,
        as:"hospital",
        attributes:["hospitalname","id"], 
      }
      ],
      order: [["id", "ASC"]],
    });
    res.status(200).json(getHospital);
  } catch (error) {
    res.status(400).json({ message: `Something went wrong ${error}` });
  }
};

module.exports = {
  addNodalHospital,
  getNodalHospital,
  getNodalHospitalById,
  updateNodalHospital,
  getAllNodalHospitals,
  getHospitalByNodal,
};
