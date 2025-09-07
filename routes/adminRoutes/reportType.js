const express = require("express");
const router = express.Router();
const reportTypeController = require("../../controller/adminController/masterController/reportTypeMaster");
const validate = require("../../middlewares/validate");
const { reportTypeSchema } = require("../../validations/reportTypeValidation.js");

// CRUD routes with validation
router.post("/", validate(reportTypeSchema), reportTypeController.createReportType);
router.get("/", reportTypeController.getAllReportTypes);
router.get("/:id", reportTypeController.getReportTypeById);
router.put("/:id", validate(reportTypeSchema), reportTypeController.updateReportType);
router.delete("/:id", reportTypeController.deleteReportType);

module.exports = router;
