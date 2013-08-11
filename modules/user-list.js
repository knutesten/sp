var Users = require('../models/users');

// Get a list of the usernames and their full name.
module.exports = function getUserList(callback) {
  Users.find().exec(function (err, users) {
    if (err) {
      callback(err);
    }

    var userList = {};
    for (var i in users) {
      userList[users[i].username] = users[i].name; 
    }

    callback(null, userList);
  });
}
