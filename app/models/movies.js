'use strict';


const mongoose = require('mongoose');
const crypto = require('crypto');

const Schema = mongoose.Schema;
const uuid = require('uuid')

const MoviesSchema = new Schema({
  movie_id : { type : String , default : uuid.v4()},
  name: {type: String},
  director: {type: String},
  cast: {type: String},
  production: {type: String},
  image_url: {type: String},
  genres: [{
    type: String
  }],
  release_date: { type: Date },
  created_at: { type: Date, default : Date.now()},
  updated_at: { type: Date, default : Date.now()},
  up_votes : {type: Number, default : 0},
  down_votes : {type: Number, default : 0},
  rating : { type : Number, default:null, precision :2}
})
mongoose.model('Movies', MoviesSchema);
const Movies = mongoose.model('Movies');

exports.getFavouriteMovies = (favouriteGenres, count, offset) => {

  return Movies.find({ favourite_genres:  { "$in" : favouriteGenres}})
        .skip(offset).limit(count)
}

exports.findOne = (args) => {
  return Movies.findOne(args)
}

exports.upVote = (movieId, voteValue) => {
  return Movies.update({ movie_id: movieId}, { $inc: { up_vote: voteValue }})
}

exports.upVote = (movieId, voteValue) => {
  return Movies.update({ movie_id: movieId}, { $inc: { down_vote: voteValue }})
}

exports.addRating = (movieId, rating) => {
  if(!rating)
    return Promise.reslove()
  return Movies.update({ movie_id: movieId}, { rating })
}

exports.getTopRated = ( count, offset) => {
  return Movies.find({})
    .skip(offset)
    .limit(count)
    .sort({
     rating: -1
    })
}
