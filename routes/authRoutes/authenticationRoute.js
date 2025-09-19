const Router = require("express");
const {
  login,
  verifyOtp,
  resendOtp,
  createUser,
  assignRole,
} = require("../../controller/authenticationController/authenticationController");
const validate = require("../../middlewares/validate");
const { userSchema } = require("../../validations/userValidation");
const router = Router();

/// Authentication Routes
// router.route("/create-user").post(registration);
// router.route("/signin").post(login);
// router.route("/verifyotp").post(verifyOtp);
// router.route("/resendotp/:userid").post(resendOtp);

router.route("/create-user").post( createUser);
router.route("/assign-role").post(assignRole);
router.route("/signin").post(login);
router.route("/verifyotp").post(verifyOtp);
router.route("/resendotp/:userid").post(resendOtp);

module.exports = router;
