'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Droid = models.droid;

const authenticate = require('./concerns/authenticate');
const setUser = require('./concerns/set-current-user');
const setModel = require('./concerns/set-mongoose-model');

const index = (req, res, next) => {
  Droid.find()
    .then(droids => res.json({
      droids: droids.map((e) =>
        e.toJSON({ virtuals: true, user: req.user })),
    }))
    .catch(next);
};

const show = (req, res) => {
  res.json({
    droid: req.droid.toJSON({ virtuals: true, user: req.user }),
  });
};

const create = (req, res, next) => {
  let droid = Object.assign(req.body.droid, {
    _owner: req.user._id,
  });
  Droid.create(droid)
    .then(droid =>
      res.status(201)
        .json({
          droid: droid.toJSON({ virtuals: true, user: req.user }),
        }))
    .catch(next);
};

const update = (req, res, next) => {
  delete req.body._owner;
  req.droid.update(req.body.droid)
    .then(() => res.sendStatus(204))
    .catch(next);
};

const destroy = (req, res, next) => {
  req.droid.remove()
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
  { method: setModel(Droid), only: ['show'] },
  { method: setModel(Droid, { forUser: true }), only: ['update', 'destroy'] },
], });
