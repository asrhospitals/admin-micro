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
  updateUsers,
  updateRole,
  getUserSession,
  logout,
  getUserSessionAdmin,
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

// anand 

router.route('/update-users/:id').put(updateUsers);

router.route('/update-roles/:id').put(updateRole);

router.route("/get-sessions").get(getUserSession);

// router.route("/get-admin-session").get(getUserSessionAdmin)

router.route("/logout").post(logout);

module.exports = router;
