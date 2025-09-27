const ColorMaster = require("../../../model/adminModel/masterModel/colormaster");

// ✅ Create
const createColor = async (req, res) => {
  try {
    const { status_of_color } = req.body;
    const existingColor = await ColorMaster.findOne({
      where: { status_of_color },
    });

    if (existingColor) {
      return res
        .status(409)
        .json({
          success: false,
          message: "Color for this status already exists",
        });
    }

    await ColorMaster.create(req.body);

    return res.status(201).json({ message: "Color created successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All
const getAllColors = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const { count, rows } = await ColorMaster.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["id", "ASC"]],
    });

    const totalPages = Math.ceil(count / limit);

    if (!rows) {
      return res.status(404).json({ message: "No color or status found" });
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
  } catch (e) {
    res.status(400).send({ message: `Something went wrong ${e}` });
  }
};

// ✅ Get By ID
const getColorById = async (req, res) => {
  try {
    const color = await ColorMaster.findByPk(req.params.id);

    if (!color) {
      return res
        .status(404)
        .json({ success: false, message: "Color not found" });
    }

    return res.status(200).json(color);
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
      return res
        .status(404)
        .json({ success: false, message: "Color not found" });
    }

    await color.update(req.body);
    return res.status(200).json({ message: "Color updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createColor,
  getAllColors,
  getColorById,
  updateColor,
};
