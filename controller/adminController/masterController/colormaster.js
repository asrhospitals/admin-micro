const ColorMaster = require("../../../model/adminModel/masterModel/colormaster");

// ✅ Create
const createColor = async (req, res) => {
  try {
    const { colorstatus, colorname, colorcode } = req.body;

    // Simple validation
    if (!colorstatus || !colorname || !colorcode?.hex || !colorcode?.rgb || !colorcode?.hsl) {
      return res.status(400).json({ 
        success: false, 
        message: "colorstatus, colorname, and complete colorcode (hex, rgb, hsl) are required" 
      });
    }

    // Check if color already exists
    const existingColor = await ColorMaster.findOne({
      where: { colorstatus },
    });

    if (existingColor) {
      return res.status(409).json({ success: false, message: "Color already exists" });
    }

    // Create the color record
    const color = await ColorMaster.create(req.body);

    return res.status(201).json({ success: true, data: color });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Get All
const getAllColors = async (req, res) => {
  try {
    const colors = await ColorMaster.findAll();

    if (!colors || colors.length === 0) {
      return res.status(404).json({ success: false, message: "No colors found" });
    }
    return res.status(200).json({ success: true, data: colors });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get By ID
const getColorById = async (req, res) => {
  try {
    const { id } = req.params;
    const color = await ColorMaster.findByPk(id);

    if (!color) {
      return res.status(404).json({ success: false, message: "Color not found" });
    }

    return res.status(200).json({ success: true, data: color });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update
const updateColor = async (req, res) => {
  try {
    const { id } = req.params;
    const color = await ColorMaster.findByPk(id);

    if (!color) {
      return res.status(404).json({ success: false, message: "Color not found" });
    }

    await color.update(req.body);
    return res.status(200).json({ success: true, data: color });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete
const deleteColor = async (req, res) => {
  try {
    const { id } = req.params;
    const color = await ColorMaster.findByPk(id);

    if (!color) {
      return res.status(404).json({ success: false, message: "Color not found" });
    }

    await color.destroy();
    return res.status(200).json({ success: true, message: "Color deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createColor,
  getAllColors,
  getColorById,
  updateColor,
  deleteColor,
};
