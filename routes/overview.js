var generateOverview = require('../modules/overview')
  , getProtocolList  = require('../modules/protocol-list')
  , getUserList      = require('../modules/user-list');

exports.restrict = true;

exports.get = function (req, res) {
  // Get the signed in user
  var loggedIn = req.session.user.username;

  var callbacksLeft = 3;
  var overview
    , protocols
    , users;

  generateOverview(loggedIn, function (err, results) {
    if (err) {
      // TODO: Handle error.
    } else {
      overview = results;

      if (--callbacksLeft == 0) {
        done();
      }
    }
  });

  getProtocolList(loggedIn, function (err, results) {
    if (err) {
      // TODO: Handle error.
    } else {
      protocols = results;

      if (--callbacksLeft == 0) {
        done();
      }
    }
  });

  getUserList(function (err, results) {
    if (err) {
      // TODO: Handle error.
    } else {
      users = results;

      if (--callbacksLeft == 0) {
        done();
      }
    }
  });

  function done() {
    res.render('overview', { loggedIn: loggedIn, overview: overview, protocols: protocols, users: users });
  }
};
