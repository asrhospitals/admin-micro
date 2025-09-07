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
    const specimens = await SpecimenTypeMaster.findAll();
    if (!specimens || specimens.length === 0) {
      return res.status(404).json({ success: false, message: "No specimen types found" });
    }
    return res.status(200).json({ success: true, data: specimens });
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
  try {
    const { id } = req.params;
    const specimen = await SpecimenTypeMaster.findByPk(id);

    if (!specimen) {
      return res.status(404).json({ success: false, message: "Specimen type not found" });
    }

    await specimen.update(req.body);
    return res.status(200).json({ success: true, data: specimen });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete
const deleteSpecimenType = async (req, res) => {
  try {
    const { id } = req.params;
    const specimen = await SpecimenTypeMaster.findByPk(id);

    if (!specimen) {
      return res.status(404).json({ success: false, message: "Specimen type not found" });
    }

    await specimen.destroy();
    return res.status(200).json({ success: true, message: "Specimen type deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createSpecimenType,
  getAllSpecimenTypes,
  getSpecimenTypeById,
  updateSpecimenType,
  deleteSpecimenType,
};