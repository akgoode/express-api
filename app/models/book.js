'use strict';

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  original_language:{
    type: String
  },
  first_published:{
    type: Number,
    match: /^\d{4}$/
  },
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
