const router = require("express").Router();
const authCheck = require("../middleware/check-auth");

/**controller funtions of user */
const { buyPlan, buyBasicPlan, differenceDate, delateDate } = require("../controllers/buy-plan");

/**
 * @description   this route is used to create a new user
 * @route   POST      /buy-plan/
 * @access  Private
 */
router.post("/", authCheck, buyPlan);
router.post("/basic", buyBasicPlan);
// router.post("/basic", authCheck, buyBasicPlan);
router.get("/details/:planId", differenceDate);
router.delete("/delete/:planId", delateDate);
// router.post("/", authCheck, buyPlan);
// router.post("/", authCheck, buyPlan);
// router.get("/", authCheck, getPlan);
// /api/buy-plan
module.exports = router;
