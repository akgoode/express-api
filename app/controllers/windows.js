'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Window = models.window;

const authenticate = require('./concerns/authenticate');
const setUser = require('./concerns/set-current-user');
const setModel = require('./concerns/set-mongoose-model');

const index = (req, res, next) => {
  Window.find()
    .then(windows => res.json({
      windows: windows.map((e) =>
        e.toJSON({ virtuals: true, user: req.user })),
    }))
    .catch(next);
};

const show = (req, res) => {
  res.json({
    window: req.window.toJSON({ virtuals: true, user: req.user }),
  });
};

const create = (req, res, next) => {
  let window = Object.assign(req.body.window, {
    _owner: req.user._id,
  });
  Window.create(window)
    .then(window =>
      res.status(201)
        .json({
          window: window.toJSON({ virtuals: true, user: req.user }),
        }))
    .catch(next);
};

const update = (req, res, next) => {
  delete req.body._owner;
  req.window.update(req.body.window)
    .then(() => res.sendStatus(204))
    .catch(next);
};

const destroy = (req, res, next) => {
  req.window.remove()
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
  { method: setModel(Window), only: ['show'] },
  { method: setModel(Window, { forUser: true }), only: ['update', 'destroy'] },
], });
