const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");
const Order = require('../models/Order');
const config = require("../config/database");
const razorpay = require("razorpay");
var instance = new razorpay({
  key_id: config.keys.razorpay.keyId,
  key_secret: config.keys.razorpay.keySecret,
});
router.get('/', (req, res) => {
  Order.find()
    .exec()
    .then((result) => {
      res.json({ success: true, result: result })
    })
    .catch(err => {
      res.json({ success: false, message: "server error" })
    })
})


router.post('/', checkAuth, (req, res) => {
  try {
    var options = {
      amount: req.body.price, // amount in the smallest currency unit
      currency: "INR",
      receipt: "MI" + new Date().getTime(),
      payment_capture: "0",
    };
    instance.orders.create(options, async (err, ord) => {
      if (err) {
        res.json({ sucess: false, error: err });
      } else {
        const order = new Order({
          tag: req.body.tag,
          data: req.body.data,
          price: req.body.price,
          raz_order_id: ord.id,
          userId: req.userData.userId,
        })
        order.save()
          .then((result) => {
            return res.json({ success: true, message: "order has been created", result: result })
          })
          .catch(err => {
            return res.json({ success: false, error: "server error" })
          })
      }

    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

//complet payroute
router.patch('/:id', (req, res) => {
  try {
    const id = req.params.id; //payment_id
    instance.payments.fetch(id, (err, info) => {
      if (err) {
        return res.json({ success: false, error: "Inavlid callback url" });
      } else if (!info.order_id) {
        return res.json({ success: false, error: "Invalid orderId" });
      } else if (info.captured) {
        data = {
          capture: true,
          raz_payment_id: info.id,
          raz_status: info.status,
        };
        Order.findOne({ $and: [{ raz_order_id: info.order_id }, { capture: false }] })
          .exec()
          .then((result) => {
            if (result) {
              Order.updateOne(
                { raz_order_id: info.order_id },
                { $set: data },
                { new: true, useFindAndModify: false }
              ).exec()
               .then((ret) => {
                 return res.json({success: true, message:"payment successful" })
               })
               .catch(e1 => {
                return res.json({success: false, message: "razor pay error"})
               })
            }else {
              res.json({success: false, message: "No order found"})
            }
            
          })
      }
    })

  } catch (err) {
    res.json({success: false, message: "server error"})
  }
})

module.exports = router;