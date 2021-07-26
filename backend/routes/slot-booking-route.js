const router = require("express").Router();
const authCheck = require("../middleware/check-auth");

/**controller funtions of user */
const {
  createSlotBooking,
  updateSlotBooking,
  getAllBookingForAdmin,
} = require("../controllers/slot-booking");

/**
 * @description   this route is used to create a new user
 * @route   POST      /slot-book/
 * @access  Private
 */
router.post("/", authCheck, createSlotBooking);

/**
 * @description   this route is used to create a new user
 * @route   POST      /slot-book/bookingId/:bookingId
 * @access  Private
 */
 router.patch("/bookingId/:bookingId", authCheck, updateSlotBooking);

/**
 * @description   this route is used to get loggedin user info
 * @route   GET      /slot-book/
 * @access  Private
 */
router.get("/page/:page/limit/:limit", getAllBookingForAdmin);

module.exports = router;
