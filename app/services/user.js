'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');
const UserModel = require("../models/user")
const _ = require('lodash')

exports.create = (input) => {
  return this.checkEmail(input.email)
    .then(userExists => {
      if(userExists) {
        return Promise.resolve({
          auth_token : userExists.auth_token
        })
      }
      const user = new User(input);
      return user.save()
    })

}

exports.checkEmail = (email) => {
  return UserModel.findOne({ email })
}

exports.setFavouriteGenres = (userId, favouriteGenres) => {
   return UserModel.findOne({ _id : userId })
     .then(user => {
       const _favouriteGenres = _.uniq(user.favourite_genres.concat(favouriteGenres))
       return UserModel.setFavouriteGenres({_id: userId}, _favouriteGenres)
     })
}


