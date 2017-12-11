'use strict';

const users = require('../app/controllers/users');
const movies = require('../app/controllers/movies');
const passport = require('passport');

module.exports = function (app) {

  app.post('/register' ,users.create);

  app.put('/users/favourites',  passport.authenticate("bearer", { session: false } ) ,users.setFavouriteGenres)
  app.get('/movies/favourites', passport.authenticate("bearer", { session: false } ),movies.getFavouriteMovies)
  app.put('/movies/:/movieId/up-vote', passport.authenticate("bearer", { session: false } ), movies.upVote)
  app.put('/movies/:/movieId/down-vote', passport.authenticate("bearer", { session: false } ), movies.downVote)
  app.put('/movies/:/movieId/review',passport.authenticate("bearer", { session: false } ), movies.addReview)
  app.get('/movies/top-rated', passport.authenticate("bearer", { session: false } ), movies.getTopRated)
  app.get('/movies/:movieId' ,passport.authenticate("bearer", { session: false } ),  movies.getMovieById)

};

