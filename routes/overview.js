var generateOverview = require('../modules/overview')
  , getProtocolList  = require('../modules/protocol-list');

exports.restrict = true;

exports.get = function (req, res) {
  // Get the signed in user
  var loggedIn = req.session.user.username;
  generateOverview(loggedIn, function (err, overview) {
    if (err) {
      // TODO: Handle error.
    } else {
      res.render('overview', { overview: overview });
    }
  });

  getProtocolList(loggedIn, function (err, protocols) {
  });
};
