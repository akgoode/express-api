'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Tree = models.tree;

const authenticate = require('./concerns/authenticate');
const setUser = require('./concerns/set-current-user');
const setModel = require('./concerns/set-mongoose-model');

const index = (req, res, next) => {
  Tree.find()
    .then(trees => res.json({
      trees: trees.map((e) =>
        e.toJSON({ virtuals: true, user: req.user })),
    }))
    .catch(next);
};

const show = (req, res) => {
  res.json({
    tree: req.tree.toJSON({ virtuals: true, user: req.user }),
  });
};

const create = (req, res, next) => {
  let tree = Object.assign(req.body.tree, {
    _owner: req.user._id,
  });
  Tree.create(tree)
    .then(tree =>
      res.status(201)
        .json({
          tree: tree.toJSON({ virtuals: true, user: req.user }),
        }))
    .catch(next);
};

const update = (req, res, next) => {
  delete req.body._owner;
  req.tree.update(req.body.tree)
    .then(() => res.sendStatus(204))
    .catch(next);
};

const destroy = (req, res, next) => {
  req.tree.remove()
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
  { method: setModel(Tree), only: ['show'] },
  { method: setModel(Tree, { forUser: true }), only: ['update', 'destroy'] },
], });
