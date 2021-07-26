const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

// Slot Model Definition
const scheduleSchema = new Schema({
  name: { type: String },
  phone: { type: String },
  eamil: { type: String },
  date: {type:Date},
  time : {type: Date},
  type:{type: Boolean,default: false },
  service: {type:String},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Export Module/Schema
module.exports = mongoose.model("schedule", scheduleSchema);
