const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");
const Coupon = require('../models/Coupon');

router.post('/', checkAuth, (req, res) => {
    const coupon = new Coupon({
        code: req.body.code,
        value: req.body.value
    })

    coupon.save()
          .then((result) => {
              res.json({success : true, result: result});
          })
          .catch(err => {
            res.json({success : false,  error: err});
          })
          
})

router.get('/:code', checkAuth, (req, res) => {
    const code = req.params.code.toUpperCase();
    Coupon.findOne({code : code})
          .exec()
          .then((result) => {
            if(result) {
                return res.json({success: true, result : result})
            }
            res.json({success: false, message: "Coupon code not found"})
          })
          .catch(err => {
            res.json({success: false, message: "server error"})
          })
})

module.exports = router;