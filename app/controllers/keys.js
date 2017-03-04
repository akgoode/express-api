'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Key = models.key;

const authenticate = require('./concerns/authenticate');
const setUser = require('./concerns/set-current-user');
const setModel = require('./concerns/set-mongoose-model');

const index = (req, res, next) => {
  Key.find()
    .then(keys => res.json({
      keys: keys.map((e) =>
        e.toJSON({ virtuals: true, user: req.user })),
    }))
    .catch(next);
};

const show = (req, res) => {
  res.json({
    key: req.key.toJSON({ virtuals: true, user: req.user }),
  });
};

const create = (req, res, next) => {
  let key = Object.assign(req.body.key, {
    _owner: req.user._id,
  });
  Key.create(key)
    .then(key =>
      res.status(201)
        .json({
          key: key.toJSON({ virtuals: true, user: req.user }),
        }))
    .catch(next);
};

const update = (req, res, next) => {
  delete req.body._owner;
  req.key.update(req.body.key)
    .then(() => res.sendStatus(204))
    .catch(next);
};

const destroy = (req, res, next) => {
  req.key.remove()
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
  { method: setModel(Key), only: ['show'] },
  { method: setModel(Key, { forUser: true }), only: ['update', 'destroy'] },
], });
