const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

// Item Model Definition
const addressSchema = new Schema({
  address : {type:String},
  city: { type: String },
  postalcode: { type: Number },
  state: { type: String},
  userId: {type:mongoose.Types.ObjectId, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Address", addressSchema);