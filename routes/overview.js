var Protocols = require('../models/protocols')
  , Users = require('../models/users');

exports.require = true;

exports.get = function (req, res) {
  console.log('overview');
  res.render('overview');
};
