const router = require("express").Router();

/**controller function */
const { loginUser, loginAdmin } = require("../controllers/authentication");


/**
 * @description   this route is used to login a user
 * @route   POST      /api/authentication/login
 * @access  Public
 */
router.post("/login", loginUser);

/**
 * @description   this route is used to login a user
 * @route   POST      /api/authentication/admin/login
 * @access  Public
 */
router.post("/admin/login", loginAdmin);

module.exports = router;
