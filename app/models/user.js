'use strict';


const mongoose = require('mongoose');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  username: { type: String, default: '' },
  hashed_password: { type: String, default: '' },
  salt: { type: String, default: '' },
  auth_token: { type: String, default: crypto.randomBytes(64).toString('hex') },
  favourite_genres :  [{type: String , default: []}]
});


UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  })



UserSchema.methods = {


  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },


  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },


  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },


};
mongoose.model('User', UserSchema);

const User = mongoose.model('User');


exports.findOne = (args) => {
  return User.findOne(args)
}

exports.setFavouriteGenres = (userId, favouriteGenres) => {
  return User.update({ _id: userId}, {favourite_genres : favouriteGenres})
}




