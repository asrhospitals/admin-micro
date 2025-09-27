const SpecimenTypeMaster = require("../../../model/adminModel/masterModel/specimenTypeMaster");

// ✅ Create
const createSpecimenType = async (req, res) => {
  try {
    const existingSpecimen = await SpecimenTypeMaster.findOne({
      where: { specimenname: req.body.specimenname },
    });

    if (existingSpecimen) {
      return res.status(409).json({ success: false, message: "Specimen type already exists" });
    }
    const specimen = await SpecimenTypeMaster.create(req.body);
    return res.status(201).json({ success: true, data: specimen });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All
const getAllSpecimenTypes = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const { count, rows } = await SpecimenTypeMaster.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["id", "ASC"]],
    });

    const totalPages = Math.ceil(count / limit);

    if (!rows) {
      return res.status(404).json({ message: "No specimen found" });
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
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get By ID
const getSpecimenTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const specimen = await SpecimenTypeMaster.findByPk(id);

    if (!specimen) {
      return res.status(404).json({ success: false, message: "Specimen type not found" });
    }

    return res.status(200).json({ success: true, data: specimen });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update
const updateSpecimenType = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const updateSpecimen = await SpecimenTypeMaster.findByPk(req.params.id);
    if (!updateSpecimen) {
      return res.status(200).json({ message: "Specimen not found" });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Updated data not provided" });
    }

    await updateSpecimen.update(req.body, {
      transaction,
    });
    await transaction.commit();
    res.status(200).json({
      message: "Specimen updated successfully",
    });
  } catch (e) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${e}` });
  }
};


// 5. Get All Specimens
const getAllSpecimen=async (req,res) => {
  try {
    const getSpecimens=await SpecimenTypeMaster.findAll({order:[['id','ASC']]});
    res.status(200).json(getSpecimens);
  } catch (error) {
     res.status(400).send({ message: `Something went wrong ${error}` });
  }
}



module.exports = {
  createSpecimenType,
  getAllSpecimenTypes,
  getSpecimenTypeById,
  updateSpecimenType,
  getAllSpecimen
};