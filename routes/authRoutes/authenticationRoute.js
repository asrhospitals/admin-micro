const Router = require("express");
const {
  login,
  verifyOtp,
  resendOtp,
  createUser,
  assignRole,
  getAllUsers,
  searchUsers,
  getUserById,
} = require("../../controller/authenticationController/authenticationController");
const router = Router();

/// Authentication Routes
router.route("/create-user").post( createUser);
router.route("/assign-role").post(assignRole);
router.route("/signin").post(login);
router.route("/verifyotp").post(verifyOtp);
router.route("/resendotp/:userid").post(resendOtp);
router.route("/get-all-users").get(getAllUsers);
router.route("/get-user/:id").get(getUserById);
router.route("/search-users").get(searchUsers);

module.exports = router;
