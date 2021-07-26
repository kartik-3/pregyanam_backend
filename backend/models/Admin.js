const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

// Admin Model Definition
const adminSchema = new Schema({
  email: { type: String },
  password: { type: String },
  name: { type: String },
  superAdmin: { type: Boolean, default: false },
  otp: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Schema Middleware to Encrypt Password
adminSchema.pre("save", function (next) {
  var user = this;
  // Ensure password is new or modified before applying encryption
  if (!user.isModified("password")) return next();

  // Apply encryption
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) return next(err); // Ensure no errors
    user.password = hash;
    // Apply encryption to password
    next(); // Exit middleware
  });
});

// Methods to compare password to encrypted password upon login
adminSchema.methods.comparePassword = function (pwd) {
  var result = bcrypt.compareSync(pwd, this.password);
  if (result) {
    return result;
  } else {
    return false;
  }
};

// Export Module/Schema
module.exports = mongoose.model("Admin", adminSchema);
