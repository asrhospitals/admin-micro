const sequelize = require("../../../db/connectDB");
const ReferralDoctor = require("../../../model/adminModel/masterModel/referalDoctorMaster");
const { Hospital } = require("../../../model/associatemodels/associatemodel");

// 1. Add Referral Doctor
const addRefDoctor = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const checkRefDoc = await ReferralDoctor.findOne(
      {
        where: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("ref_doc_name")),
          sequelize.fn("LOWER", req.body.ref_doc_name)
        ),
      },
      { transaction }
    );
    if (checkRefDoc) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Referral Doctor with this name already exists",
        error: "DUPLICATE_REF_DOCTOR_NAME",
      });
    }
    await ReferralDoctor.create(req.body, { transaction });
    await transaction.commit();
    res.status(201).json({ message: "Referral Doctor added successfully" });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ message: `Something went wrong ${error}` });
  }
};

// 2. Get Referral Doctor
const getRefDoc = async (req, res) => {
  try {
    // Add pagination
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const { count, rows } = await ReferralDoctor.findAndCountAll({
        include:[
        {
            model:Hospital,
            as: "hospital",
            attributes: [ "hospitalname"]
        }
        ],
      limit: limit,
      offset: offset,
      order: [["id", "ASC"]],
    });
    const totalPages = Math.ceil(count / limit);

    if (!rows) {
      return res.status(404).json({ message: "No data found" });
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
  } catch (error) {
    res.status(400).json({ message: `Something went wrong ${error}` });
  }
};

// 3. Get Referral Doctor by ID
const getRefDocById = async (req, res) => {
  try {
    const refDoctor = await ReferralDoctor.findByPk(req.params.id);
    if (!refDoctor) {
      return res.status(404).json({ message: "Referral Doctor not found" });
    }
    res.status(200).json(refDoctor);
  } catch (error) {
    res.status(400).json({ message: `Something went wrong ${error}` });
  }
};

// 4. Update Referral Doctor

const updateRefDoc = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const updateRefDoc = await ReferralDoctor.findByPk(req.params.id);
    if (!updateRefDoc) {
      return res.status(200).json({ message: "Referral Doctor not found" });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Updated data not provided" });
    }

    await updateRefDoc.update(req.body, {
      transaction,
    });
    await transaction.commit();
    res.status(200).json({
      message: "Referral Doctor updated successfully",
    });
  } catch (e) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${e}` });
  }
};
module.exports = { addRefDoctor, getRefDoc, getRefDocById, updateRefDoc };
