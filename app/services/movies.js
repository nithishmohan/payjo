'use strict';

const MoviesModel = require("../models/movies")
const UserModel = require('../models/user')
const VotingsModel = require('../models/votes')
const ReviewsModel = require('../models/reviews')
const async = require('async')
const _ = require('lodash')
const when = require("when")

exports.getFavouriteMovies = ({ userId, count = 500, offset =0 }) => {
  return UserModel.findOne({ _id : userId})
    .then(user => MoviesModel.getFavouriteMovies(user.favourite_genres, count, offset))
}

exports.upVote = (userId, movieId) => {

  return when.join(
    MoviesModel.findOne({ _id: movieId}),
    VotingsModel.findOne({ movie_id: movieId, voted_by : userId})
  )
    .then(([ movie, vote]) => {
      let voteValue = 1
      let up_vote = true
      if(_.isEmpty(movie)) {
        return Promise.reject({
          code : "movie_not_available",
          message: "Movie not available"
        })
      }
      if(!_.isEmpty(vote) && (vote.up_vote === true)){
        voteValue = -1
        up_vote = false
      }

      if(!_.isEmpty(vote) && (vote.down_vote === true)){
        return Promise.resolve()
      }

      return new Promise((resolve, reject) => {
        function rollback (doc, cb) {
          doc.remove(cb);
        }
        async.parallel([
            VotingsModel.upVote(userId, movieId, up_vote),
            MoviesModel.upVote(movieId, voteValue),
          ],
          function (err, results) {
            if (err) {
              async.each(results, rollback, function () {
                reject()
              });
            } else {
              resolve()
            }
          });

      });

  })

}

exports.downVote = (userId, movieId) => {

  return when.join(
    MoviesModel.findOne({ _id: movieId}),
    VotingsModel.findOne({ movie_id: movieId, voted_by : userId})
  )
    .then(([ movie, vote]) => {
      if(_.isEmpty(movie)) {
        return Promise.reject({
          code : "movie_not_available",
          message: "Movie not available"
        })
      }
      let voteValue = 1
      let down_vote = true

      if(!_.isEmpty(vote) && (vote.down_vote === true)){
        voteValue = -1
        down_vote = false
      }

      if(!_.isEmpty(vote) && (vote.up_vote === true)){
        return Promise.resolve()
      }

      return new Promise((resolve, reject) => {
        function rollback (doc, cb) {
          doc.remove(cb);
        }
        async.parallel([
            VotingsModel.downVote(userId, movieId, down_vote),
            MoviesModel.downVote(movieId, voteValue),
          ],
          function (err, results) {
            if (err) {
              async.each(results, rollback, function () {
                reject()
              });
            } else {
              resolve()
            }
          });

      });

    })

}

exports.addReview = ({userId, movieId, content, rating}) => {

  function findRating(overAllRating, previousRating, rating ,count) {
    return _.isEmpty(previousRating) ? (((overAllRating * 100)/count + rating ) * (count +1))/100 :  (((overAllRating * 100)/count + rating - previousRating.rating ) * (count))/100
  }

  return when.join(
    MoviesModel.findOne({ _id: movieId}),
    ReviewsModel.findOne({ movie_id: movieId, voted_by : userId}),
    ReviewsModel.getCount({ movie_id: movieId})
  )
  .then(([ movie, previousReview, count]) => {
    if(_.isEmpty(movie)) {
      return Promise.reject({
        code : "movie_not_available",
        message: "Movie not available"
      })
    }

    const newRating = rating? (movie.rating != null ? findRating(movie.rating, previousReview, rating, count) : rating) : (previousReview && previousReview.rating ? previousReview.rating : null)
    const newContent = content ? content : (previousReview && previousReview.content ? previousReview.content : null)
    return new Promise((resolve, reject) => {
      function rollback (doc, cb) {
        doc.remove(cb);
      }
      async.parallel([
          ReviewsModel.addReview(userId, movieId, newContent, newRating),
          MoviesModel.addRating(movieId, newRating),
        ],
        function (err, results) {
          if (err) {
            async.each(results, rollback, function () {
              reject()
            });
          } else {
            resolve()
          }
        });

    });

  })
}


exports.getTopRated = ({count = 100, offset =0}) => {
  return MoviesModel.getTopRated(count, offset)
}

exports.getMovieById = (movieId) => {
  return MoviesModel.findOne(({ movie_id : movieId}))
    .then(movie => {
      return {
        name : movie.name,
        director : movie.director,
        cast : movie.cast,
        production : movie.production,
        imageUrl : movie.image_url,
        genres : movie.genres,
        releaseDate : movie.release_date,
        upVotes : movie.up_vote,
        downVote : movie.downVote,
        rating : movie.rating
      }
    })
}