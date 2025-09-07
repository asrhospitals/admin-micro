const ReportType = require("../../../model/adminModel/masterModel/reportTypeMaster");

// ✅ Create
const createReportType = async (req, res) => {
  try {
    const existingReportType = await ReportType.findOne({
      where: { reporttype: req.body.reporttype },
    });

    if (existingReportType) {
      return res.status(409).json({ success: false, message: "Report type already exists" });
    }
    const reportType = await ReportType.create(req.body);
    return res.status(201).json({ success: true, data: reportType });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All
const getAllReportTypes = async (req, res) => {
  try {
    const reportTypes = await ReportType.findAll();
    return res.status(200).json({ success: true, data: reportTypes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get By ID
const getReportTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const reportType = await ReportType.findByPk(id);

    if (!reportType) {
      return res.status(404).json({ success: false, message: "Report type not found" });
    }

    return res.status(200).json({ success: true, data: reportType });
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
      return res.status(404).json({ success: false, message: "Report type not found" });
    }

    await reportType.update(req.body);
    return res.status(200).json({ success: true, data: reportType });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete
const deleteReportType = async (req, res) => {
  try {
    const { id } = req.params;
    const reportType = await ReportType.findByPk(id);

    if (!reportType) {
      return res.status(404).json({ success: false, message: "Report type not found" });
    }

    await reportType.destroy();
    return res.status(200).json({ success: true, message: "Report type deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReportType,
  getAllReportTypes,
  getReportTypeById,
  updateReportType,
  deleteReportType,
};