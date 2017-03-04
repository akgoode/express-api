'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Lamp = models.lamp;

const authenticate = require('./concerns/authenticate');
const setUser = require('./concerns/set-current-user');
const setModel = require('./concerns/set-mongoose-model');

const index = (req, res, next) => {
  Lamp.find()
    .then(lamps => res.json({
      lamps: lamps.map((e) =>
        e.toJSON({ virtuals: true, user: req.user })),
    }))
    .catch(next);
};

const show = (req, res) => {
  res.json({
    lamp: req.lamp.toJSON({ virtuals: true, user: req.user }),
  });
};

const create = (req, res, next) => {
  let lamp = Object.assign(req.body.lamp, {
    _owner: req.user._id,
  });
  Lamp.create(lamp)
    .then(lamp =>
      res.status(201)
        .json({
          lamp: lamp.toJSON({ virtuals: true, user: req.user }),
        }))
    .catch(next);
};

const update = (req, res, next) => {
  delete req.body._owner;
  req.lamp.update(req.body.lamp)
    .then(() => res.sendStatus(204))
    .catch(next);
};

const destroy = (req, res, next) => {
  req.lamp.remove()
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
  { method: setModel(Lamp), only: ['show'] },
  { method: setModel(Lamp, { forUser: true }), only: ['update', 'destroy'] },
], });
