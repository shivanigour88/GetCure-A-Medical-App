const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

// exports signup function to handle user signup
exports.signup = (req, res) => {
  // check for any errors in user input using express-validator
  const errors = validationResult(req);

  // if there are errors, return a 422 status and the error message
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  // create a new user with the input data
  const user = new User(req.body);
  // save the user to the database
  user.save((err, user) => {
    // if there is an error saving the user, return a 400 status and an error message
    if (err) {
      return res.status(400).json({
        error: "NOT able to save user in DB",
      });
    }
    // if successful, return the user's name, email, and id
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

// exports signin function to handle user signin
exports.signin = (req, res) => {
  // check for any errors in user input using express-validator
  const errors = validationResult(req);
  // destructuring email and password from the input data
  const { email, password } = req.body;

  // if there are errors, return a 422 status and the error message
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  // search for the user with the provided email
  User.findOne({ email }, (err, user) => {
    // if there is an error or the user doesn't exist, return a 400 status and an error message
    if (err || !user) {
      return res.status(400).json({
        error: "USER email does not exists",
      });
    }

    // check if the provided password matches the user's password
    if (!user.autheticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match",
      });
    }

    // create a token using the user's id and the secret
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    // set the token in a cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    // destructuring the user's id, name, email, and role
    const { _id, name, email, role } = user;
    // return the token and the user data
    return res.json({ token, user: { _id, name, email, role } });
  });
};

// exports signout function to handle user signout
exports.signout = (req, res) => {
  // clear the token cookie
  res.clearCookie("token");
  res.json({
    message: "User signout successfully",
  });
};

//protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
  console.log(req.profile);
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not ADMIN, Access denied",
    });
  }
  next();
};
