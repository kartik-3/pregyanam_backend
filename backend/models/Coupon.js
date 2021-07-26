const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

// Slot Model Definition
const couponSchema = new Schema({
  code : {type:String},
  value: {type:Number},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Export Module/Schema
module.exports = mongoose.model("Coupon", couponSchema);
