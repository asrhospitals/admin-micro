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
    const { nodalid, hospitalid, isactive } = req.bdy;

    // Check that Nodal actually exists
    const NodalExists = await Nodal.findByPk(nodalid, {
      transaction,
    });
    if (!NodalExists) {
      await transaction.rollback();
      return res.status(404).json({ message: "Parent nodal not found." });
    }

    // Check that Hospital actually exists
    const HospitalExists = await Hospital.findByPk(hospitalid, {
      transaction,
    });
    if (!HospitalExists) {
      await transaction.rollback();
      return res.status(404).json({ message: "Parent hospital not found." });
    }

    await NodalHospital.create(req.body, {
      transaction,
    });
    await transaction.commit();
    res.status(201).json({ message: "Nodal hosiptal created successfully" });
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
      return res.status(404).json({ message: "NodalHospital not found" });
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
    const updatenodal = await NodalHospital.findByPk(req.params.id);
    if (!updatenodal) {
      await transaction.rollback();
      return res
        .status(200)
        .json({ message: "NodalHospital record not found" });
    }

    if (Object.keys(req.body).length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "Updated data not provided" });
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

module.exports = {
  addNodalHospital,
  getNodalHospital,
  getNodalHospitalById,
  updateNodalHospital,
};
