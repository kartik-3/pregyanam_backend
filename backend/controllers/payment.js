// const config = require("../config/database");
// const razorpay = require("razorpay");
// const mongoose = require("mongoose");
// const Payment = require("../models/Payment");

// var instance = new razorpay({
//     key_id: config.keys.razorpay.keyId,
//     key_secret: config.keys.razorpay.keySecret,
//   });

//   exports.createPayment = async (req, res, next) => {
//     try {
//       var options = {
//         amount: req.body.amount, // amount in the smallest currency unit
//         currency: "INR",
//         receipt: "PN" + new Date().getTime(),
//         payment_capture: "0",
//       };
//       // instance.orders.create(options, async (err, order) => {
//       //   if (err) {
//       //     res.json({ sucess: false, error: err });
//       //   } else {
//       //     const payment = new Payment({
//       //       order: order.id,
//       //       amount: order.amount / 100,
//       //       capture: false,
//       //       receipt: order.receipt,
//       //       userId: req.userData.userId,
//       //       created_at: order.created_at,
//       //     });
//       //     let result = await payment.save();
//       //     const credit = new Credit({
//       //       credit: (order.amount * 4) / 100,
//       //       amount: order.amount / 100,
//       //       user: req.userData.userId,
//       //       raz_order_id: order.id,
//       //       raz_status: "created",
//       //       created_at: Date.now(),
//       //     });
//       //     await credit.save();
//       //     res.status(201).json({ success: true, data: result });
//       //   }
//       // });
//     } catch (error) {
//       res.status(500).json({ success: false, error });
//     }
//   };
    