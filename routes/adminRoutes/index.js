const express = require("express");
const router = express.Router();

const kitRoutes = require("./kitRoutes");
const reportTypeRoutes = require("./reportType");
const colorRoutes = require("./colorRoutes");
const specimenTypeRoutes = require("./specimenTypeRoutes");

router.use("/kits", kitRoutes);
router.use("/report-types", reportTypeRoutes);
router.use("/colors", colorRoutes);
router.use("/specimen-types", specimenTypeRoutes);

module.exports = router;
