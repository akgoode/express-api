'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Cat = models.cat;

const authenticate = require('./concerns/authenticate');
const setUser = require('./concerns/set-current-user');
const setModel = require('./concerns/set-mongoose-model');

const index = (req, res, next) => {
  Cat.find()
    .then(cats => res.json({
      cats: cats.map((e) =>
        e.toJSON({ virtuals: true, user: req.user })),
    }))
    .catch(next);
};

const show = (req, res) => {
  res.json({
    cat: req.cat.toJSON({ virtuals: true, user: req.user }),
  });
};

const create = (req, res, next) => {
  let cat = Object.assign(req.body.cat, {
    _owner: req.user._id,
  });
  Cat.create(cat)
    .then(cat =>
      res.status(201)
        .json({
          cat: cat.toJSON({ virtuals: true, user: req.user }),
        }))
    .catch(next);
};

const update = (req, res, next) => {
  delete req.body._owner;
  req.cat.update(req.body.cat)
    .then(() => res.sendStatus(204))
    .catch(next);
};

const destroy = (req, res, next) => {
  req.cat.remove()
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
  { method: setModel(Cat), only: ['show'] },
  { method: setModel(Cat, { forUser: true }), only: ['update', 'destroy'] },
], });
