var hash = require("./pass").hash;

var users = {
  knutesten: { username: "knutesten" }
};

hash('fortsett', function (err, salt, hash) {
  users.knutesten.salt = salt;
  users.knutesten.hash = hash;
});

exports.authenticate = function (username, password, callback) {
  var user = users[username];
  if (!user) {
    return callback(new Error('Cannot find user'));
  }

  hash(password, user.salt, function (err, hash) {
    if (err) {
      return callback(err);
    }

    if (hash == user.hash) {
      return callback(null, user);
    }

    callback(new Error('Invalid password'));
  });
};

exports.authenticateCookie = function (username, hash, callback) {
  var user = users[username];
  if (!user) {
    return callback(new Error('Cannot find user'));
  }

  if (hash = user.hash) {
    return callback(null, user);
  }
};
