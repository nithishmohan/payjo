'use strict';


const mongoose = require('mongoose')
const crypto = require('crypto')
const Schema = mongoose.Schema

const VotesSchema = new Schema({
  voted_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  movie_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Movies'},
  up_vote : { type: Boolean, default : false},
  down_vote: { type: Boolean, default : false},
  created_at: { type: Date, default : Date.now()},
  updated_at: { type: Date, default : Date.now()},
})
mongoose.model('Votes', VotesSchema);
const Movies = mongoose.model('Votes');

exports.upVote = (userId, movieId, up_vote) => {

  return Movies.update(
    {
      voted_by: userId,
      movie_id : movieId
    },
    {
      voted_by : userId,
      movie_id : movieId,
      up_vote : up_vote,
    },
    {
      upsert:true
    })

}



exports.downVote = (userId, movieId, up_vote) => {

  return Movies.update(
    {
      voted_by: userId,
      movie_id : movieId
    },
    {
      voted_by : userId,
      movie_id : movieId,
      down_vote : up_vote,
    },
    {
      upsert:true
    })

}


