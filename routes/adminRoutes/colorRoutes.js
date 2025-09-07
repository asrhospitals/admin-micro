const express = require("express");
const router = express.Router();
const colorController = require("../../controller/adminController/masterController/colormaster");
const validate = require("../../middlewares/validate");
const { colorSchema } = require("../../validations/colorValidation");

// CRUD routes with validation
router.post("/", validate(colorSchema), colorController.createColor);
router.get("/", colorController.getAllColors);
router.get("/:id", colorController.getColorById);
router.put("/:id", validate(colorSchema), colorController.updateColor);
router.delete("/:id", colorController.deleteColor);

module.exports = router;
