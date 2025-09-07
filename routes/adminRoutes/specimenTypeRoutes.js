const express = require("express");
const router = express.Router();
const specimenTypeController = require("../../controller/adminController/masterController/specimenMaster");
const validate = require("../../middlewares/validate");
const { specimenTypeSchema } = require("../../validations/specimenTypeValidation.js");

// CRUD routes with validation
router.post("/", validate(specimenTypeSchema), specimenTypeController.createSpecimenType);
router.get("/", specimenTypeController.getAllSpecimenTypes);
router.get("/:id", specimenTypeController.getSpecimenTypeById);
router.put("/:id", validate(specimenTypeSchema), specimenTypeController.updateSpecimenType);
router.delete("/:id", specimenTypeController.deleteSpecimenType);

module.exports = router;
