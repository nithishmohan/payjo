'use strict';

const service = require('../services/movies')
const httpStatus = require('http-status')
const validator = require("../helpers/validator")


exports.getFavouriteMovies =(req, res) => {

  const input = {
    count: req.query.ps,
    offset: req.query.offset,
    userId: req.user.id
  }
  service.getFavouriteMovies(input)
    .then(movies => {
      res.status(httpStatus.OK).send(movies);
    })
    .catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ code: "500", message: "Unknown err." }).end()
    })

}

exports.upVote = (req, res) => {
  service.upVote(req.user.id, req.params.movieId)
    .then(() => {
      res.status(httpStatus.OK).end();
    })
    .catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ code: "500", message: "Unknown err." }).end()
    })
}


exports.downVote = (req, res) => {
  service.downVote(req.user.id, req.params.movieId)
    .then(() => {
      res.status(httpStatus.OK).end();
    })
    .catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ code: "500", message: "Unknown err." }).end()
    })
}

exports.addReview = (req, res) => {

  const input = {
    userId: req.user.id,
    movieId: req.params.movieId,
    content : req.body.content || "",
    rating : parseFloat(req.body.rating).toFixed(2) || null
  }

  service.addReview(input)
    .then(() => {
      res.status(httpStatus.OK).end();
    })
    .catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ code: "500", message: "Unknown err." }).end()
    })
}


exports.getTopRated = (req, res) => {
  const input = {
    count: req.query.ps,
    offset: req.query.offset,
  }
  service.getTopRated(input)
    .then(movies => {
      res.status(httpStatus.OK).send(movies);
    })
    .catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ code: "500", message: "Unknown err." }).end()
    })
}


exports.getMovieById = (req, res) => {
  service.getMovieById(req.body.movieId)
    .then(movies => {
      res.status(httpStatus.OK).send(movies);
    })
    .catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ code: "500", message: "Unknown err." }).end()
    })
}

