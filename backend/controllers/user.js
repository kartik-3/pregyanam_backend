const User = require("../models/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

exports.createNewUser = async (req, res, next) => {
  try {
    let { email, password, name, phone, city } = req.body;
    let checkEmailExist = await User.findOne({ email: email });
    if (checkEmailExist) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exist" });
    }
    let addedUser = await new User({
      email: email,
      password: password,
      name: name,
      phone: phone,
      city: city,
      // image:
    }).save();
    res.status(200).json({
      success: true,
      user: addedUser,
      message: "Registration is done Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    let userId = req.params.userId;
    let result = await User.findOne({ _id: mongoose.Types.ObjectId(userId) });
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "User Not Found" });
    }

    await User.deleteOne({ _id: mongoose.Types.ObjectId(userId) });

    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};

exports.getloggedInUserInfo = async (req, res, next) => {
  try {
    let result = await User.findById(req.userData.userId);
    res.status(200).json({ success: true, user: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

exports.updateUserInfo = async (req, res, next) => {
  try {
    await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(req.userData.userId) },
      { $set: req.body }
    );
    res.status(200).json({ success: true, message: "User details updated" });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

exports.logoutUser = async (req, res, next) => {
  try {
    req.logout();
    res.status(200).json({ success: true, message: "logout successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};

exports.checkEmailExist = async (req, res, next) => {
  try {
    const email = req.params.email;
    let result = await User.countDocuments({ email: email });
    if (result > 0) {
      res.status(200).json({ success: false, message: "Email already Exist" });
    } else {
      res.status(200).json({ success: true, message: "Email is available" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

exports.updatePasswordFromProfile = async (req, res, next) => {
  try {
    if (req.body.password == "") {
      return res
        .status(200)
        .json({ success: false, message: "Password is required" });
    }
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        res.status(500).json({ success: false, error: "Hasing error" });
      } else {
        const data = {
          password: hash,
        };
        await User.updateOne({ _id: req.userData.userId }, { $set: data });

        res
          .status(200)
          .json({ success: true, message: "Password has been updated" });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

