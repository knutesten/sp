var auth = require('../modules/auth');

exports.get = function (req, res) {
  //If a user is already logged in, redirect to main.
  if (req.session.user) {
    res.redirect('main');
  } else {
    // Check if there are cookies, if so attempt auto-login.
    if (req.cookies.username === undefined || req.cookies.hash === undefined) {
      res.render('login');
    } else {
      auth.authenticateCookie(req.cookies.username, req.cookies.hash, function(err, user) {
        if (user) {
          req.session.regenerate(function () {
            req.session.user = user;
            res.redirect('main');
          });
        } else {
          res.render('login');
        }
      });
    }
  }
};

exports.post = function (req, res) {
  auth.authenticate(req.body.username, req.body.password, function (err, user) {
    if (user) {
      req.session.regenerate(function () {
        req.session.user = user;
        var week = 7*24*60*60*1000;
        if (req.body.remember) {
          res.cookie('username', user.username, { maxAge: week });
          res.cookie('hash', user.hash, { maxAge: week });
        }

        res.redirect('main');
      });
    } else {
      res.render('login', { error: err.toString() });
    }
  });
};
