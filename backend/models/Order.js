
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

// Item Model Definition
const orderSchema = new Schema({
  tag: { type: String }, //service // potli // product
  data: {type:JSON},
  price : {type:Number},
  capture: {type:Boolean, default:false},
  raz_order_id: {type:String},
  raz_status: {type:String},
  raz_payment_id: {type:String},
  userId : {type:mongoose.Types.ObjectId, required: true},
  created_at: { type: Date, default: Date.now()},
  updated_at: {type: Date, default: Date.now()}
});

// Export Module/Schema
module.exports = mongoose.model("Order", orderSchema);