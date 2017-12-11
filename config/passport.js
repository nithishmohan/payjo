'use strict';


const local = require('./passport/local');
const userModel= require('../app/models/user')

module.exports = function (passport) {

  passport.serializeUser((user, cb) => cb(null, user.id));
  passport.deserializeUser((id, cb) => userModel.findOne({  _id: id  }, cb))

  passport.use(local);
};
