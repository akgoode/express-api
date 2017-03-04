'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Hobbit = models.hobbit;

const authenticate = require('./concerns/authenticate');
const setUser = require('./concerns/set-current-user');
const setModel = require('./concerns/set-mongoose-model');

const index = (req, res, next) => {
  Hobbit.find()
    .then(hobbits => res.json({
      hobbits: hobbits.map((e) =>
        e.toJSON({ virtuals: true, user: req.user })),
    }))
    .catch(next);
};

const show = (req, res) => {
  res.json({
    hobbit: req.hobbit.toJSON({ virtuals: true, user: req.user }),
  });
};

const create = (req, res, next) => {
  let hobbit = Object.assign(req.body.hobbit, {
    _owner: req.user._id,
  });
  Hobbit.create(hobbit)
    .then(hobbit =>
      res.status(201)
        .json({
          hobbit: hobbit.toJSON({ virtuals: true, user: req.user }),
        }))
    .catch(next);
};

const update = (req, res, next) => {
  delete req.body._owner;
  req.hobbit.update(req.body.hobbit)
    .then(() => res.sendStatus(204))
    .catch(next);
};

const destroy = (req, res, next) => {
  req.hobbit.remove()
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
  { method: setModel(Hobbit), only: ['show'] },
  { method: setModel(Hobbit, { forUser: true }), only: ['update', 'destroy'] },
], });
