exports.validateOnRegister = async (req, res, next) => {
  /* Check if email was provided*/
  if (emailLengthChecker(req.body.email) == false) {
    return res.status(400).json({
      success: false,
      message: "E-mail must be at least 5 characters but no more than 30",
    });
  }
  if (validEmailChecker(req.body.email) == false) {
    return res.status(400).json({
      success: false,
      message: "Must be a valid e-mail",
    });
  }
  if (!req.body.displayName) {
    return res.status(400).json({
      success: false,
      message: "You must provide a your name",
    }); // Return error
  }
  if (passwordLengthChecker(req.body.password) == false) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters but no more than 35",
    }); // Return error
  }
  if (validPassword(req.body.password) == false) {
    return res.status(400).json({
      success: false,
      message:
        "Must have at least one uppercase, lowercase, special character, and number",
    });
  }
  next();
};

// Validate Function to check e-mail length
const emailLengthChecker = (email) => {
  // Check if e-mail exists
  if (!email) {
    return false; // Return error
  } else {
    // Check the length of e-mail string
    if (email.length < 5 || email.length > 100) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid e-mail
    }
  }
};

// Validate Function to check if valid e-mail format
const validEmailChecker = (email) => {
  // Check if e-mail exists
  if (!email) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid e-mail
    const regExp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return regExp.test(email); // Return regular expression test results (true or false)
  }
};

// Validate Function to check password length
let passwordLengthChecker = (password) => {
  // Check if password exists
  if (!password) {
    return false; // Return error
  } else {
    // Check password length
    if (password.length < 8 || password.length > 50) {
      return false; // Return error if passord length requirement is not met
    } else {
      return true; // Return password as valid
    }
  }
};

// Validate Function to check if valid password format
let validPassword = (password) => {
  // Check if password exists
  if (!password) {
    return false; // Return error
  } else {
    // Regular Expression to test if password is valid format
    const regExp = new RegExp(
      /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/
    );
    return regExp.test(password); // Return regular expression test result (true or false)
  }
};
