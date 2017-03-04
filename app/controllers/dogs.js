'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Dog = models.dog;

const authenticate = require('./concerns/authenticate');
const setUser = require('./concerns/set-current-user');
const setModel = require('./concerns/set-mongoose-model');

const index = (req, res, next) => {
  Dog.find()
    .then(dogs => res.json({
      dogs: dogs.map((e) =>
        e.toJSON({ virtuals: true, user: req.user })),
    }))
    .catch(next);
};

const show = (req, res) => {
  res.json({
    dog: req.dog.toJSON({ virtuals: true, user: req.user }),
  });
};

const create = (req, res, next) => {
  let dog = Object.assign(req.body.dog, {
    _owner: req.user._id,
  });
  Dog.create(dog)
    .then(dog =>
      res.status(201)
        .json({
          dog: dog.toJSON({ virtuals: true, user: req.user }),
        }))
    .catch(next);
};

const update = (req, res, next) => {
  delete req.body._owner;
  req.dog.update(req.body.dog)
    .then(() => res.sendStatus(204))
    .catch(next);
};

const destroy = (req, res, next) => {
  req.dog.remove()
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
  { method: setModel(Dog), only: ['show'] },
  { method: setModel(Dog, { forUser: true }), only: ['update', 'destroy'] },
], });
