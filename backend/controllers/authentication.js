const jwt = require("jsonwebtoken");
const passport = require("passport");
const config = require("../config/database");

exports.loginUser = async (req, res, next) => {
  req.body.type = "USER";
  passport.authenticate("local", (err, user, info) => {
    if (err) {

      res.json({ success: false, message: err });
    } else if (!user) {
      res.json({ success: false, message: info.message });
    } else {
      const token = jwt.sign({ userId: user._id }, config.secret, {
        expiresIn: "30d",
      });

      res.status(200).json({
        success: true,
        token: token,
        user: user._id,
        userEmail: user.email,
        message: "Login Successfull",
      });
    }
  })(req, res, next);
};

exports.loginAdmin = async (req, res, next) => {
  req.body.type = "ADMIN";
  passport.authenticate("local", (err, user, info) => {

    if (err) {
      res.json({ success: false, message: err });
    } else if (!user) {
      res.json({ success: false, message: info.message });
    } else {
      const token = jwt.sign({
        userId: user._id,
        role:
          user.superAdmin && user.superAdmin == true ? "SUPER_ADMIN" : "ADMIN",
      }, config.secret, {
        expiresIn: "30d",
      });

      return res.status(200).json({
        success: true,
        token: token,
        user: user._id,
        role:
          user.superAdmin && user.superAdmin == true ? "SUPER_ADMIN" : "ADMIN",
        message: "Login Successfull",
      });
    }
  })(req, res, next);
};
