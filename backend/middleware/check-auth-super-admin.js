const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const keys = require("../config/database");
const Admin = require("../models/Admin");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, keys.secret);
    req.userData = decoded;

    let admin = await Admin.findOne({
      _id: mongoose.Types.ObjectId(req.userData.userId),
    });
    if (!admin) {
      return res.status(400).json({ success: false, message: "Auth failed" });
    }
    if (!admin.superAdmin || admin.superAdmin == false) {
      return res.status(400).json({ success: false, message: "Auth failed" });
    }
    next();
  } catch (error) {
    return res.json({ success: false, message: "Auth failed" });
  }
};
