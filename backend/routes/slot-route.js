const router = require("express").Router();
const authCheckAdmin = require("../middleware/check-auth-admin");
const authCheck = require("../middleware/check-auth");

/**controller funtions of user */
const {
  createSlot,
  editSlot,
  getAllSlots,
  getTimeSlotsForDate,
  getAvailableSlots,
} = require("../controllers/slot");

/**
 * @description   this route is used to create a new user
 * @route   POST      /slot/
 * @access  Private
 */
router.post("/", createSlot);


/**
 * @description   this route is used to create a update slot
 * @route   PTACH      /slot/:id
 * @access  Private
 */
 router.patch("/:id", editSlot);

/**
 * @description   this route is used to get loggedin user info
 * @route   GET      /slot/service/:service/page/:page/limit/:limit
 * @access  Private
 */
router.get(
  "/service/:service/page/:page/limit/:limit",
  authCheck,
  getAvailableSlots
);

/**admin api */
/**
 * @description   this route is used to get loggedin user info
 * @route   GET      /slot/
 * @access  Private
 */
router.get("/admin/page/:page/limit/:limit", getAllSlots);

/**
 * @description   this route is used to get loggedin user info
 * @route   GET      /slot/
 * @access  Private
 */
router.get("/admin/page/:page/limit/:limit/date/:date", getTimeSlotsForDate);

module.exports = router;
