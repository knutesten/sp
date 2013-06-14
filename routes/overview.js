var generateOverview = require('../modules/overview')
  , getProtocolList  = require('../modules/protocol-list');

exports.restrict = true;

exports.get = function (req, res) {
  // Get the signed in user
  var loggedIn = req.session.user.username;

  var callbacksLeft = 2;
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

  getProtocolList(loggedIn, function (err, results1, results2) {
    if (err) {
      // TODO: Handle error.
    } else {
      protocols = results1;
      users = results2;
      if(--callbacksLeft == 0) {
        done();
      }
    }
  });

  function done() {
    res.render('overview', { overview: overview, protocols: protocols, users: users });
  }
};
