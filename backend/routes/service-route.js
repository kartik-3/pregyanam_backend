const router = require("express").Router();
const authCheckAdmin = require("../middleware/check-auth-admin");

/**controller funtions of user */
const {
 createService,getAllServices
} = require("../controllers/service");

/**
 * @description   this route is used to create a new user
 * @route   POST      /service/
 * @access  Private
 */
router.post("/", authCheckAdmin, createService);

/**
 * @description   this route is used to get loggedin user info
 * @route   GET      /service/
 * @access  Private
 */
router.get("/page/:page/limit/:limit", getAllServices);


module.exports = router;
