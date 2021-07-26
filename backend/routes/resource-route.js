const router = require("express").Router();
const authCheckAdmin = require("../middleware/check-auth-admin");

/**controller funtions of user */
const { addResource, getAllResources } = require("../controllers/resource");

/**
 * @description   this route is used to create a new user
 * @route   POST      /resource
 * @access  Private
 */
router.post("/", authCheckAdmin, addResource);

/**admin api */
/**
 * @description   this route is used to get loggedin user info
 * @route   GET      /resource/admin/page/:page/limit/:limit
 * @access  Private
 */
router.get("/admin/page/:page/limit/:limit", authCheckAdmin, getAllResources);

module.exports = router;
