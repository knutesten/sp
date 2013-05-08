var Protocols = require('../models/protocols');
var Users = require('../models/users');

exports.restrict = true;

exports.get = function (req, res) {
  Users.find(function (err, users) {
    if (err) {
      // TODO handle error.
    } else {
      res.render('create', { users: users });
    }
  });
};


function async(arg, callback){
  args.save();
}
exports.post = function (req, res) {
  validateForm(req, function (err, protocols) {
    if (err) {
      // TODO: Find some smart way to handle this type of error. Can't really send it with res.render, because you don't have access to the users.
    } else {
      // Save all the new protocols to the database in parallel
      var protocolsLeft = protocols.length;
      protocols.forEach(function (protocol) {
        protocol.save(function (err) {
          if (err) {
            // TODO: Handle write error.
          }

          // All the protocols have been written to database.
          if (--protocolsLeft == 0){
            res.redirect('main');
          }
        });
      });
    }
  });
};

// TODO: Actual server-side validation. This might not be necessary because the chance of any of the users tampering with the POST or javascript is unlikely.
function validateForm(req, callback) {
  var protocols = [];
  var user = req.session.user.username;
  var debtors = req.body.debtors;
  
  var price = parseFloat(req.body.price);
  var debt = price / debtors.length; 
  
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
