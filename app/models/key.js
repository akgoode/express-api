'use strict';

const mongoose = require('mongoose');

const keySchema = new mongoose.Schema({
  text: {
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

keySchema.virtual('length').get(function length() {
  return this.text.length;
});

const Key = mongoose.model('Key', keySchema);

module.exports = Key;
