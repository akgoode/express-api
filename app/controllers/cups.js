'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Cup = models.cup;

const authenticate = require('./concerns/authenticate');
const setUser = require('./concerns/set-current-user');
const setModel = require('./concerns/set-mongoose-model');

const index = (req, res, next) => {
  Cup.find()
    .then(cups => res.json({
      cups: cups.map((e) =>
        e.toJSON({ virtuals: true, user: req.user })),
    }))
    .catch(next);
};

const show = (req, res) => {
  res.json({
    cup: req.cup.toJSON({ virtuals: true, user: req.user }),
  });
};

const create = (req, res, next) => {
  let cup = Object.assign(req.body.cup, {
    _owner: req.user._id,
  });
  Cup.create(cup)
    .then(cup =>
      res.status(201)
        .json({
          cup: cup.toJSON({ virtuals: true, user: req.user }),
        }))
    .catch(next);
};

const update = (req, res, next) => {
  delete req.body._owner;
  req.cup.update(req.body.cup)
    .then(() => res.sendStatus(204))
    .catch(next);
};

const destroy = (req, res, next) => {
  req.cup.remove()
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
  { method: setModel(Cup), only: ['show'] },
  { method: setModel(Cup, { forUser: true }), only: ['update', 'destroy'] },
], });
