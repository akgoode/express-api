'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Kenzie = models.kenzie;

const authenticate = require('./concerns/authenticate');
const setUser = require('./concerns/set-current-user');
const setModel = require('./concerns/set-mongoose-model');

const index = (req, res, next) => {
  Kenzie.find()
    .then(kenzies => res.json({
      kenzies: kenzies.map((e) =>
        e.toJSON({ virtuals: true, user: req.user })),
    }))
    .catch(next);
};

const show = (req, res) => {
  res.json({
    kenzie: req.kenzie.toJSON({ virtuals: true, user: req.user }),
  });
};

const create = (req, res, next) => {
  let kenzie = Object.assign(req.body.kenzie, {
    _owner: req.user._id,
  });
  Kenzie.create(kenzie)
    .then(kenzie =>
      res.status(201)
        .json({
          kenzie: kenzie.toJSON({ virtuals: true, user: req.user }),
        }))
    .catch(next);
};

const update = (req, res, next) => {
  delete req.body._owner;
  req.kenzie.update(req.body.kenzie)
    .then(() => res.sendStatus(204))
    .catch(next);
};

const destroy = (req, res, next) => {
  req.kenzie.remove()
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
  { method: setModel(Kenzie), only: ['show'] },
  { method: setModel(Kenzie, { forUser: true }), only: ['update', 'destroy'] },
], });
