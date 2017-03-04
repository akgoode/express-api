'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Movie = models.movie;

const authenticate = require('./concerns/authenticate');
const setUser = require('./concerns/set-current-user');
const setModel = require('./concerns/set-mongoose-model');

const index = (req, res, next) => {
  Movie.find()
    .then(movies => res.json({
      movies: movies.map((e) =>
        e.toJSON({ virtuals: true, user: req.user })),
    }))
    .catch(next);
};

const show = (req, res) => {
  res.json({
    movie: req.movie.toJSON({ virtuals: true, user: req.user }),
  });
};

const create = (req, res, next) => {
  let movie = Object.assign(req.body.movie, {
    _owner: req.user._id,
  });
  Movie.create(movie)
    .then(movie =>
      res.status(201)
        .json({
          movie: movie.toJSON({ virtuals: true, user: req.user }),
        }))
    .catch(next);
};

const update = (req, res, next) => {
  delete req.body._owner;
  req.movie.update(req.body.movie)
    .then(() => res.sendStatus(204))
    .catch(next);
};

const destroy = (req, res, next) => {
  req.movie.remove()
    .then(() => res.sendStatus(204))
    .catch(next);
};

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
}, { before: [
  { method: setUser, only: ['index', 'show'] },
  { method: authenticate, except: ['index', 'show'] },
  { method: setModel(Movie), only: ['show'] },
  { method: setModel(Movie, { forUser: true }), only: ['update', 'destroy'] },
], });
