var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var protocolsSchema = new Schema({
  id: ObjectId,
  ware: String,
  buyer: String,
  price: Number,
  date: String,
  debtors: [{
    username: String,
    debt: Number
  }]
});

module.exports = mongoose.model('Protocols', protocolsSchema);
