'use strict';

const mongoose = require('mongoose');

const droidSchema = new mongoose.Schema({
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

droidSchema.virtual('length').get(function length() {
  return this.name.length;
});

const Droid = mongoose.model('Droid', droidSchema);

module.exports = Droid;
