const router = require("express").Router();
const authCheck = require("../middleware/check-auth");

/**controller funtions of user */
const {
  getloggedInUserInfo,
  createNewUser,
  deleteUser,
  updateUserInfo,
  updatePasswordFromProfile,
  logoutUser,
  checkEmailExist
} = require("../controllers/user");

/**
 * @description   this route is used to create a new user
 * @route   POST      /user/
 * @access  Private
 */
router.post("/", createNewUser);

/**
 * @description   this route is used to get loggedin user info
 * @route   GET      /user/
 * @access  Private
 */
router.get("/", authCheck, getloggedInUserInfo);

/**
 * @description   this route is used to delete existing user
 * @route   DELETE      /user/userId/:userId
 * @access  Private
 */
router.delete("/userId/:userId", authCheck, deleteUser);

/**
 * @description   this route is used to update profile info for user
 * @route   PATCH      /user/
 * @access  Private
 */
router.patch("/update-password", authCheck, updatePasswordFromProfile);

/**
 * @description   this route is used to update profile info for user
 * @route   PATCH      /user/
 * @access  Private
 */
router.patch("/", authCheck, updateUserInfo);

/**
 * @description   this route is used to check for username exist
 * @route   GET      /user/user-exist/:username
 * @access  Private
 */
router.get("/user-exist/email/:email", checkEmailExist);

/**
 * @description   this route is used to logout
 * @route   POST      /user/logout
 * @access  Private
 */
router.post("/logout", authCheck, logoutUser);

module.exports = router;
