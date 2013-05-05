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

exports.post = function (req, res) {
  validateForm(req, function (err, ware, price, date, debtors) {
    if (err) {
      // TODO: Find some smart way to handle this type of error. Can't really send it with res.render, because you don't have access to the users.
    } else {
      new Protocols({
        ware: ware,
        price: price,
        date: date,
        buyer: req.session.user.username,
        debtors: debtors
      }).save(function (err) {
        if (err) {
          // TODO: Handle this type of errors, maybe make an error page where you can route all types of errors
        } else {
          res.redirect('overview');
        }
      });
    }
  });
};

// TODO: Actual server-side validation. This might not be necessary because the chance of any of the users tampering with the POST or javascript is unlikely.
function validateForm(req, callback) {
  var user = req.session.user.username;
  var selectedDebtors = req.body.debtors;
  
  var price = parseFloat(req.body.price);
  var debt = price / selectedDebtors.length; 
  
  var debtors = [];
  for (var key in selectedDebtors) {
    if (user == selectedDebtors[key]) {
      continue;
    }
  
    debtors.push({
      username: selectedDebtors[key],
      debt: debt
    });
  }

  callback(null, req.body.ware, price, req.body.date, debtors);
};
