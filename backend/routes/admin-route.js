const router = require("express").Router();
const authCheckAdmin = require("../middleware/check-auth-admin");
const authCheckSuperAdmin = require("../middleware/check-auth-super-admin");

/**controller funtions of user */
const {
  createNewAdmin,
  getAllAdmin,
  getloggedInUserInfo,
  deleteAdmin,
  updatePasswordFromProfile,
  updateUserInfo,
  checkEmailExist,
  logoutUser,
} = require("../controllers/admin");

/**
 * @description   this route is used to create a new user
 * @route   POST      /admin/
 * @access  Private
 */
router.post("/", authCheckSuperAdmin, createNewAdmin);

/**
 * @description   this route is used to get all admins
 * @route   GET      /admin/page/:page/limit/:limit?name=sample
 * @access  Private
 */
 router.get("/page/:page/limit/:limit", authCheckAdmin, getAllAdmin);

/**
 * @description   this route is used to get loggedin user info
 * @route   GET      /admin/
 * @access  Private
 */
router.get("/", authCheckAdmin, getloggedInUserInfo);

/**
 * @description   this route is used to delete existing user
 * @route   DELETE      /admin/adminId/:adminId
 * @access  Private
 */
router.delete("/adminId/:adminId", authCheckAdmin, deleteAdmin);

/**
 * @description   this route is used to update profile info for user
 * @route   PATCH      /admin/update-password
 * @access  Private
 */
router.patch("/update-password", authCheckAdmin, updatePasswordFromProfile);

/**
 * @description   this route is used to update profile info for user
 * @route   PATCH      /admin/
 * @access  Private
 */
router.patch("/adminId/:adminId", authCheckAdmin, updateUserInfo);

/**
 * @description   this route is used to check for username exist
 * @route   GET      /admin/admin-exist/email/:email
 * @access  Private
 */
router.get("/admin-exist/email/:email", checkEmailExist);

/**
 * @description   this route is used to logout
 * @route   POST      /admin/logout
 * @access  Private
 */
router.post("/logout", authCheckAdmin, logoutUser);

module.exports = router;
