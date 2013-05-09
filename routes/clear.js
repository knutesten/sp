var Protocols = require('../models/protocols')
  , generateOverview = require('../modules/overview');

exports.restrict = true;

exports.get = function (req, res) {
  var loggedIn = req.session.user.username;
  generateOverview(loggedIn, function(err, overview) {
    if (err) {
      // TODO: Handle error.
    } else {
      // Remove the users that the logged in user don't owe money.
      for (var user in overview) {
        if (overview[user].owed <= 0) {
          delete overview[user];
        }
      }

      res.render('clear', { overview: overview });
    }
  });
}

// TODO: Server side validation of the amount, it should not be larger than your debt. The lender should also be checked.
exports.post = function (req, res) {
  var loggedIn = req.session.user.username;
  var lender = req.body.lender;
  var amount = req.body.amount;
  var protocolsToUpdate = [];

  Protocols
    .find({ 
      buyer: lender,
      debtor: loggedIn
    })
    .sort({ date: 1 })
    .exec(function (err, protocols) {
      if (err) {
        // TODO: Handle error.
      } else {
        for (var i in protocols) {
          if (amount <= protocols[i].debtLeft) {
            protocols[i].debtLeft -= amount;
            protocolsToUpdate.push(protocols[i]);
            break;
          } else {
            amount -= protocols[i].debtLeft;
            protocols[i].debtLeft = 0;
            protocolsToUpdate.push(protocols[i]);
          }
        }
        updateProtocols();
      }
    });

  // Called when the protocols have been changed and are ready for update.  
  function updateProtocols() {
    var updatesLeft = protocolsToUpdate.length;
    for (var i in protocolsToUpdate) {
      var p = protocolsToUpdate[i];
      Protocols.update({ _id: p._id }, { debtLeft: p.debtLeft }, function (err, nr) {
        if (err) {
          // TODO: Handle error.
        }
        if (--updatesLeft == 0) {
          done();
        }
      });
    }
  }
  
  // Called when everything is done.
  function done() {
    res.redirect('overview');
  }
}
