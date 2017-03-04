'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Sword = models.sword;

const authenticate = require('./concerns/authenticate');
const setUser = require('./concerns/set-current-user');
const setModel = require('./concerns/set-mongoose-model');

const index = (req, res, next) => {
  Sword.find()
    .then(swords => res.json({
      swords: swords.map((e) =>
        e.toJSON({ virtuals: true, user: req.user })),
    }))
    .catch(next);
};

const show = (req, res) => {
  res.json({
    sword: req.sword.toJSON({ virtuals: true, user: req.user }),
  });
};

const create = (req, res, next) => {
  let sword = Object.assign(req.body.sword, {
    _owner: req.user._id,
  });
  Sword.create(sword)
    .then(sword =>
      res.status(201)
        .json({
          sword: sword.toJSON({ virtuals: true, user: req.user }),
        }))
    .catch(next);
};

const update = (req, res, next) => {
  delete req.body._owner;
  req.sword.update(req.body.sword)
    .then(() => res.sendStatus(204))
    .catch(next);
};

const destroy = (req, res, next) => {
  req.sword.remove()
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
  { method: setModel(Sword), only: ['show'] },
  { method: setModel(Sword, { forUser: true }), only: ['update', 'destroy'] },
], });
