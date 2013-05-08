var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var protocolsSchema = new Schema({
  id: ObjectId,
  buyer: String,
  date: String,
  ware: String,
  debtor: String,
  originalDebt: Number,
  debtLeft: Number
});

module.exports = mongoose.model('Protocols', protocolsSchema);
