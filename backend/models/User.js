const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

// User Model Definition
const userSchema = new Schema({

  firstname: { type: String },
  lastname: { type: String },
  email: { type: String },
  password: { type: String },
  name: { type: String },
  phone: { type: String },
  otp: { type: String },
  email_verified: { type: Boolean, default: false },
  basicUser: { type: Boolean, default: false },
  city: { type: String },
  history: [{}],
  token: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Schema Middleware to Encrypt Password
userSchema.pre("save", function (next) {
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
userSchema.methods.comparePassword = function (pwd) {
  var result = bcrypt.compareSync(pwd, this.password);
  if (result) {
    return result;
  } else {
    return false;
  }
};

// Export Module/Schema
module.exports = mongoose.model("User", userSchema);
