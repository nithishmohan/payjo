'use strict';


const mongoose = require('mongoose');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const ReviewsSchema = new Schema({
  content: {type: String},
  rating: {type: Number, default: null , precision : 2},
  voted_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  movie_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Movies'},
  created_at: { type: Date, default : Date.now()},
  updated_at: { type: Date, default : Date.now()},
})
mongoose.model('Reviews', ReviewsSchema);
const Reviews = mongoose.model('Reviews');


exports.findOne = (args) => {
  return Reviews.findOne(args)
}

exports.getCount = ( userId, movieId) => {
  return Reviews.count({user_id: userId, movie_id : movieId})
}
exports.addReview = ( userId, movieId, review, rating) => {

  return Reviews.update(
    {
      user_id: userId,
      movie_id : movieId
    }, {
      user_id: userId,
      movie_id : movieId,
      review,
      rating
    },{
      upsert : true
    })


}
