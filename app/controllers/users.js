'use strict';

const service = require('../services/user')
const httpStatus = require('http-status')
const validator = require("../helpers/validator")
const _ = require('lodash')


exports.create =  (req, res) => {
  const input = req.body
  const email = input.email.toLowerCase().trim();
  if (!validator.isValidEmail(email)) {
    res.status(httpStatus.BAD_REQUEST).json({ code: "invalid_email", message: "Enter a valid email address to register." }).end()
    return false;
  }

  if (!validator.validateRegistrationDetails(input)) {
    res.status(httpStatus.BAD_REQUEST).json({ code: "invalid_registration_details", message: "invalid registration details." }).end()
    return false;
  }

  service.create(input)
    .then(user => {
        res.status(httpStatus.OK).json({ code: "200", message: "User account created successfully." ,  auth: true, token: user.auth_token }).end()
    })
    .catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ code: "500", message: "Unknown err." }).end()
    })

}


exports.setFavouriteGenres = (req, res) => {
  const userId = req.user.id

    if(!_.isArray(req.body.favouriteGenres)){
      res.status(httpStatus.BAD_REQUEST).json({ code: "invalid_genres", message: "favourite genres should be an array" }).end()
      return false;
    }

  service.setFavouriteGenres(userId, req.body.favouriteGenres)
    .then(() => {
      res.status(httpStatus.OK).json({ code: "200", message: "The genre saves as successfully." }).end()
    })
    .catch(err => {
      console.log(err)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ code: "500", message: "Unknown err." }).end()
    })

}
exports.signin = function () {};

/**
 * Auth callback
 */

exports.authCallback = login;



/**
 * Session
 */

exports.session = login;

/**
 * Login
 */

function login (req, res) {
  const redirectTo = req.session.returnTo
    ? req.session.returnTo
    : '/';
  delete req.session.returnTo;
  res.redirect(redirectTo);
}
