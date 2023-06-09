
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var transactionSchema = Schema( {
  description: String,
  category: String,
  amount: Number,
  edit: Boolean,
  date: Date,
  createdAt: Date,
  userId: {type:ObjectId, ref:'user' }
} );

module.exports = mongoose.model( 'Transaction', transactionSchema );
