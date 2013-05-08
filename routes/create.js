var Protocols = require('../models/protocols');
var Users = require('../models/users');

exports.restrict = true;

exports.get = function (req, res) {
  Users.find(function (err, users) {
    if (err) {
      // TODO handle error.
    } else {
      // Move the signed in user to the top of the list.
      var logedIn = req.session.user.username;
      for (var i in users) {
        if (users[i].username == logedIn) {
          var tmp = users[i];
          users[i] = users[0];
          users[0] = tmp;
        }
      }

      res.render('create', { users: users });
    }
  });
};

exports.post = function (req, res) {
  validateForm(req, function (err, protocols) {
    if (err) {
      // TODO: Find some smart way to handle this type of error. Can't really send it with res.render, because you don't have access to the users.
    } else {
      // Save all the new protocols to the database in parallel
      var protocolsLeft = protocols.length;
      for (var i in protocols) {
        protocols[i].save(function (err) {
          if (err) {
            // TODO: Handle write error.
          }

          //Is true when alle the protocols have been writen to the database.
          if (--protocolsLeft == 0){
            res.redirect('overview');
          }
        });
      }
    }
  });
};

// TODO: Actual server-side validation. This might not be necessary because the chance of any of the users tampering with the POST or javascript is unlikely.
function validateForm(req, callback) {
  var protocols = [];
  var user = req.session.user.username;
  var debtors = req.body.debtors;
  // Make sure that debtors is a list, or else .length will give the wrong value.
  debtors = debtors instanceof Array?debtors:[debtors];
  
  var price = parseFloat(req.body.price);
  var debt = price / debtors.length; 
  console.log(debt);
  
  for (var key in debtors) {
    if (user == debtors[key]) {
      continue;
    }

    protocols.push(new Protocols({
      buyer: user,
      date: req.body.date,
      ware: req.body.ware,
      debtor: debtors[key],
      originalDebt: debt,
      debtLeft: debt
    }));
  }

  callback(null, protocols);
};
