var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var usersSchema = new Schema({
  username: String,
  hash: String,
  salt: String,
  name: String
});

module.exports = mongoose.model('Users', usersSchema);
