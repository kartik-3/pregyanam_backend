const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require('morgan');
const config = require("./config/database");
const path = require("path");
require("./config/passport-setup");

/**importing routes */
const authentication = require("./routes/authentication"); // Import Authentication Routes
const user = require("./routes/user-route");
const admin = require("./routes/admin-route");
const service = require("./routes/service-route");
const slot = require("./routes/slot-route");
const slotBooking = require("./routes/slot-booking-route");
const buyPlan = require("./routes/buy-plan-route");
const blog = require("./routes/blog-route");
const resource = require("./routes/resource-route");
const adminService = require("./routes/admin-service-route");
const scheduleRoute = require('./routes/schedule-route');
const addressRoute = require('./routes/address-route');
const orderRoute  =  require('./routes/order-route');
const couponRoute = require('./routes/coupon-route');
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 8080;

mongoose.Promise = global.Promise;
mongoose.connect(
  config.uri,
  {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // reconnectTries: 30,
    // reconnectInterval: 500,
    useFindAndModify: false,
  },
  (err) => {
    if (err) {
      console.log("connection lost" + err);
    } else {
      console.log("DB is connected");
    }
  }
);

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(express.static("public"));

// Middleware
// express-session must be used before passport
app.use("/api/authentication", authentication);
app.use("/api/user", user);
app.use("/api/admin", admin);
app.use("/api/service", service);
app.use("/api/slot", slot);
app.use("/api/slot-book", slotBooking);
app.use("/api/buy-plan", buyPlan);
app.use("/api/blog", blog);
app.use("/api/resource", resource);
app.use("/api/admin-service", adminService);
app.use("/api/schedule", scheduleRoute);
app.use("/api/address", addressRoute);
app.use('/api/order', orderRoute)
app.use('/api/coupon', couponRoute);


//Start Server: Listen on port 8080
let server = app.listen(port, () => {
  console.log("Listening on port 8080");
});
