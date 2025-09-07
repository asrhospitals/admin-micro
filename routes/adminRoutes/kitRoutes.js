const express = require("express");
const router = express.Router();
const kitController = require("../../controller/adminController/masterController/kitmaster");
const validate = require("../../middlewares/validate");
const { kitSchema } = require("../../validations/kitValidation");

router.post("/", validate(kitSchema), kitController.createKit);
router.get("/", kitController.getAllKits);
router.get("/:id", kitController.getKitById);
router.put("/:id", validate(kitSchema), kitController.updateKit);
router.delete("/:id", kitController.deleteKit);

module.exports = router;
