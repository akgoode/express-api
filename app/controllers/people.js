'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Person = models.person;

const authenticate = require('./concerns/authenticate');
const setUser = require('./concerns/set-current-user');
const setModel = require('./concerns/set-mongoose-model');

const index = (req, res, next) => {
  Person.find()
    .then(people => res.json({
      people: people.map((e) =>
        e.toJSON({ virtuals: true, user: req.user })),
    }))
    .catch(next);
};

const show = (req, res) => {
  res.json({
    person: req.person.toJSON({ virtuals: true, user: req.user }),
  });
};

const create = (req, res, next) => {
  let person = Object.assign(req.body.person, {
    _owner: req.user._id,
  });
  Person.create(person)
    .then(person =>
      res.status(201)
        .json({
          person: person.toJSON({ virtuals: true, user: req.user }),
        }))
    .catch(next);
};

const update = (req, res, next) => {
  delete req.body._owner;
  req.person.update(req.body.person)
    .then(() => res.sendStatus(204))
    .catch(next);
};

const destroy = (req, res, next) => {
  req.person.remove()
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
  { method: setModel(Person), only: ['show'] },
  { method: setModel(Person, { forUser: true }), only: ['update', 'destroy'] },
], });
