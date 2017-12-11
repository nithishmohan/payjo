'use strict';


const mongoose = require('mongoose');
const BearerStrategy = require('passport-http-bearer').Strategy;
const userModel =require('../../app/models/user')
const User = mongoose.model('User');


module.exports = new BearerStrategy(
  function(token, done) {
    userModel.findOne({ auth_token: token })
      .then(user => {
        if(!user) {
          return done(null, false)
        }
          const _user = {
            id : user._id,
            email : user.email
          }
          return done(null, _user, { scope: 'all' })
      })
      .catch(err => {
        return done(err)
      })

  }
);
