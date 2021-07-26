const Service = require("../models/Service");
const UserPlan = require("../models/User_Plan");
const mongoose = require("mongoose");
const moment = require('moment');

exports.buyPlan = async (req, res) => {
  try {
    let { activateDate, service, expireDate } = req.body;
    let user = req.userData.userId;

    if (!service || service == "") {
      return res
        .status(400)
        .json({ success: true, message: "Select a plan to Buy" });
    }
    if (!expireDate || expireDate == "") {
      return res
        .status(400)
        .json({ success: true, message: "Expire Date is required" });
    }

    let newPlan = {
      activateDate,
      service,
      user,
      expireDate,
    };
    await new UserPlan(newPlan).save();
    res
      .status(201)
      .json({ success: true, message: "Plan Added to Your Account!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

exports.buyBasicPlan = async (req, res) => {
  try {
    let { _id, price, activateDate } = req.body;

    // let { activateDate:new Date(), expireDate, price } = req.body;
    // let user = req.userData.userId;

    // if (!service || service == "") {
    //   return res
    //     .status(400)
    //     .json({ success: true, message: "Select a plan to Buy" });
    // }
    // if (!expireDate || expireDate == "") {
    //   return res
    //     .status(400)
    //     .json({ success: true, message: "Expire Date is required" });
    // }
    // let activateDate = new Date();
    if (_id === 33) {
      let tempDate = new Date();
      let expireDate = (tempDate.setMonth(tempDate.getMonth() + 3));
      let newPlan = {
        activateDate,
        // service,
        // user,
        expireDate: moment(expireDate).format(),
        price
      };
      console.log(newPlan);
      // await new UserPlan(newPlan).save();
      res
        .status(201)
        .json({ success: true, message: "3 Basic Plan Added to Your Account!" });
    } else if (_id === 66) {
      let tempDate = new Date();
      let expireDate = (tempDate.setMonth(tempDate.getMonth() + 6));
      let newPlan = {
        activateDate,
        // service,
        // user,
        expireDate: moment(expireDate).format(),
        price
      };
      console.log(newPlan);
      // await new UserPlan(newPlan).save();
      res
        .status(201)
        .json({ success: true, message: "6 Months Basic Plan Added to Your Account!" });
    } else {
      let tempDate = new Date();
      let expireDate = (tempDate.setMonth(tempDate.getMonth() + 9));
      let newPlan = {
        activateDate,
        // service,
        // user,
        expireDate: moment(expireDate).format(),
        price
      };
      console.log(newPlan);
      // await new UserPlan(newPlan).save();
      res
        .status(201)
        .json({ success: true, message: " 9 Months Basic Plan Added to Your Account!" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

exports.delateDate = async (req, res) => {
  // let allposts = req.allposts;
  let planId = mongoose.Types.ObjectId(req.params.planId);

  let data = await UserPlan.findById({ _id: planId });
  await data.remove((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'errorHandler(err)',
      });
    }
    res.json({
      message: 'Plan is deleted is deleted',
    });
  });
};

exports.differenceDate = async (req, res) => {
  try {
    let planId = mongoose.Types.ObjectId(req.params.planId);

    if (!planId || planId == "") {
      return res
        .status(400)
        .json({ success: true, message: "no plans selected" });
    }
    let data = await UserPlan.findById({ _id: planId });

    const diffTime = Math.abs(data.expireDate - data.activateDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    res
      .status(201)
      .json({ success: true, message: `${diffDays} days are left` })

  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
}