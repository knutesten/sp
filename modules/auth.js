var hash = require('./pass').hash;
var Users = require('../models/users');

/*
hash('fortsett', function (err, salt, hash) {
  new Users({
    username: 'knutesten',
    hash: hash,
    salt: salt,
    name: 'Knut Esten Melandsø Nekså'
  }).save();
});
*/

exports.authenticate = function (username, password, callback) {
  Users.findOne({ username: username }, function (err, user) {
    if (err) {
      return callback(err);
    }

    if (!user) {
      return callback(new Error('Cannot find user.'));
    }

    hash(password, user.salt, function (err, hash) {
      if (err) {
        return callback(err);
      }

      if (hash == user.hash) {
        return callback(null, user);
      }

      callback(new Error('Invalid password.'));
    });
  });
};

exports.authenticateCookie = function (username, hash, callback) {
  Users.findOne({ username: username }, function (err, user) {
    if (err) {
      return callback(err);
    }

    if (!user) {
      return callback(new Error('Cannot find user.'));
    }

    if (hash = user.hash) {
      return callback(null, user);
    }
  });
};
