const ReportType = require("../../../model/adminModel/masterModel/reportTypeMaster");

// ✅ Create
const createReportType = async (req, res) => {
  try {
    const existingReportType = await ReportType.findOne({
      where: { reporttype: req.body.reporttype },
    });

    if (existingReportType) {
      return res
        .status(409)
        .json({ success: false, message: "Report type already exists" });
    }
    await ReportType.create(req.body);
    return res.status(201).json({ message: "Report Type Created succssfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All
const getAllReportTypes = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const { count, rows } = await ReportType.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["id", "ASC"]],
    });

    const totalPages = Math.ceil(count / limit);

    if (!rows) {
      return res.status(404).json({ message: "No department found" });
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
const getReportTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const reportType = await ReportType.findByPk(id);

    if (!reportType) {
      return res
        .status(404)
        .json({ success: false, message: "Report type not found" });
    }

    return res.status(200).json(reportType);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update
const updateReportType = async (req, res) => {
  try {
    const { id } = req.params;
    const reportType = await ReportType.findByPk(id);

    if (!reportType) {
      return res
        .status(404)
        .json({ success: false, message: "Report type not found" });
    }

    await reportType.update(req.body);
    return res.status(200).json({ message: "Report Update Successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Report Type
const getAllReport = async (req, res) => {
  try {
    const getAll = await ReportType.findAll({ order: [["id", "ASC"]] });
    res.status(200).json(getAll);
  } catch (error) {
    return res.status(500).json({ message: `Something went wrong ${error}` });
  }
};

module.exports = {
  createReportType,
  getAllReportTypes,
  getReportTypeById,
  updateReportType,
  getAllReport,
};
