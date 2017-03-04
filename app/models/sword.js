'use strict';

const mongoose = require('mongoose');

const swordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret, options) {
      let userId = (options.user && options.user._id) || false;
      ret.editable = userId && userId.equals(doc._owner);
      return ret;
    },
  },
});

swordSchema.virtual('length').get(function length() {
  return this.name.length;
});

const Sword = mongoose.model('Sword', swordSchema);

module.exports = Sword;
