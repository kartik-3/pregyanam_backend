const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

// SlotBooking Model Definition
const userPlanSchema = new Schema({
  activateDate: { type: Date, default: Date.now },
  service: { type:  mongoose.Types.ObjectId, ref: 'Service' },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  expireDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Export Module/Schema
module.exports = mongoose.model("UserPlan", userPlanSchema);
