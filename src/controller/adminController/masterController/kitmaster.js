const KitMaster = require("../../../model/adminModel/masterModel/kitmaster");

const createKit = async (req, res) => {
  try {
    const existingKit = await KitMaster.findOne({
      where: { kitname: req.body.kitname, batchno: req.body.batchno },
    });
    if (existingKit) {
      return res.status(400).json({
        success: false,
        message: "Kit with this name or batch number already exists",
      });
    }

    const kit = await KitMaster.create(req.body);
    return res.status(201).json({ success: true, data: kit });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllKits = async (req, res) => {
  try {
    const kits = await KitMaster.findAll();
    if (!kits || kits.length === 0) {
      return res.status(404).json({ success: false, message: "No kits found" });
    }
    return res.status(200).json({ success: true, data: kits });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getKitById = async (req, res) => {
  try {
    const { id } = req.params;
    const kit = await KitMaster.findByPk(id);

    if (!kit) {
      return res.status(404).json({ success: false, message: "Kit not found" });
    }

    return res.status(200).json({ success: true, data: kit });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateKit = async (req, res) => {
  try {
    const { id } = req.params;
    const kit = await KitMaster.findByPk(id);

    if (!kit) {
      return res.status(404).json({ success: false, message: "Kit not found" });
    }

    await kit.update(req.body);
    return res.status(200).json({ success: true, data: kit });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteKit = async (req, res) => {
  try {
    const { id } = req.params;
    const kit = await KitMaster.findByPk(id);

    if (!kit) {
      return res.status(404).json({ success: false, message: "Kit not found" });
    }

    await kit.destroy();
    return res
      .status(200)
      .json({ success: true, message: "Kit deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createKit,
  getAllKits,
  getKitById,
  updateKit,
  deleteKit,
};
