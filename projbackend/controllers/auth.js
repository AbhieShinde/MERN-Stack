const User = require("../models/user");
const { check, validationResult } = require('express-validator');

var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

exports.signup = ( req, res ) => {

  const errors = validationResult(req)

  if ( !errors.isEmpty() ) {
    return res.status( 422 ).json({
      error: errors.array()[0].msg
    })
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB"
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id
    });
  });
};

exports.signin = ( req, res ) => {
  const { email, password } = req.body; // destructuring in JS | getting only email and pass from the body

  const errors = validationResult(req)

  if ( !errors.isEmpty() ) {
    return res.status( 422 ).json({
      error: errors.array()[0].msg
    })
  }

  User.findOne({ email }, ( error, user ) => {
    if ( error || !user ) { // is there's a error or no user with this email found
      res.status(400).json({
        error: "User email is unregistered"
      })
    }

    if ( !user.autheticate( password ) ) {
      return res.status(401).json({
        error: "Email and Password don't match"
      });
    }
    // create token
    const token = jwt.sign( { _id: user._id }, process.env.SECRET )
    // put in cookie
    res.cookie( 'token', token, {expire: new Date() + 9999} );

    // send res to frontend
    const { _id, name, email, role } = user;
    
    return res.json({
      token,
      user: {
        _id,
        name,
        email,
        role
      }
    })

  })
}

exports.signout = ( req, res ) => {
  res.clearCookie( 'token' );
  res.json({
    message: "User signed out succesfuly!"
  });
};

// protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth" // created a auth property
});

// custom middlewares
exports.isAuthenticated = ( req, res, next ) => {
  // below we've created/assuming profile property which contains details of logged in user returned through singin controller | we can name this prop as we want
  let checker = req.profile && req.auth && req.profile._id === req.auth._id;
  if (checker) {
    return res.status(403).json({
      error: "ACCESS DENIED"
    });
  }
  next();
}

exports.isAdmin = ( req, res, next ) => {
  if ( req.profile.role === 0 ) {
    return res.status(403).json({
      error: "You're not Admin! Access Denied."
    });
  }
  next();
}