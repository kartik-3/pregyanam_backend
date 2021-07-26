const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const Admin = require("../models/Admin");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    (req,email, password, done) => {
      if(req.body.type == 'USER'){
        User.findOne({ email: email }, (err, user) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, { message: "Incorrect Email" });
          }
          if (!user.comparePassword(password)) {
            return done(null, false, { message: "Incorrect Password" });
          }
          return done(null, user);
        });
      }else{
        Admin.findOne({ $or: [{ email: email }] }, (err, user) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, { message: "Incorrect Email" });
          }
          if (!user.comparePassword(password)) {
            return done(null, false, { message: "Incorrect Password" });
          }
          return done(null, user);
        });
      }
      
    }
  )
);
