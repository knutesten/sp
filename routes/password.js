var auth = require('../modules/auth');
var hash = require('../modules/pass').hash;
var Users = require('../models/users');

exports.restrict = true;

exports.get  = function (req, res) {
  res.render('password');
};

exports.post = function (req, res) {
  auth.authenticate(req.session.user.username, req.body.current, function (err, user) {
    var new1 = req.body.new1;
    var new2 = req.body.new2;
    if(err) {
      done(err.toString());
    } else if (new1 === new2) {
      if (new1 === "") {
        done("Error: The password must contain at least one character.");
      } else {
        hash(new1, function (err, salt, hash) {
          var query = { username: req.session.user.username };
          Users.findOneAndUpdate(query, { 
            hash: hash,
            salt: salt
          }, done);
        });
      }
    } else {
      done("Error: The new passwords are not equal.");
    }

    function done(err){
      if (err) {
        res.render('password', { error: err.toString() });
      } else {
        res.render('password', { info: "Your password has been changed." });
      }
    }
  });
};
