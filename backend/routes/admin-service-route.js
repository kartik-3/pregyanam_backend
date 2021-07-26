const router = require("express").Router();
const authCheckSuperAdmin = require("../middleware/check-auth-super-admin");

/**controller funtions of user */
const { getAllAdmins } = require("../controllers/admin-service");

/**
 * @description   this route is used to create a new user
 * @route   GET      /admin/
 * @access  Private
 */
router.get("/serviceId/:serviceId", getAllAdmins);

module.exports = router;
