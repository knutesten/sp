var Protocols = require('../models/protocols');
var Users = require('../models/users');

exports.restrict = true;

exports.get = function (req, res) {
  Users.find(function (err, users) {
    if (err) {
      // TODO handle error.
    } else {
      // Move the signed in user to the top of the list.
      var loggedIn = req.session.user.username;
      for (var i in users) {
        if (users[i].username == loggedIn) {
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
  validateForm(req, function (err, protocolsToUpdate, newProtocols) {
    if (err) {
      // TODO: Find some smart way to handle this type of error. Can't really send it with res.render, because you don't have access to the users. NB: This type of error will never happen before the server side validation is implemented.
    } else {
      // Save all the new protocols to the database in parallel
      var protocolsLeft = newProtocols.length + protocolsToUpdate.length;
      for (var i in newProtocols) {
        newProtocols[i].save(function (err) {
          if (err) {
            // TODO: Handle write error.
          }

          //Is true when all the protocols have been written to the database.
          if (--protocolsLeft == 0){
            writeDone();
          }
        });
      }

      for (var i in protocolsToUpdate) {
        var p = protocolsToUpdate[i];
        Protocols.update({ _id: p._id }, { debtLeft: p.debtLeft }, function (err, nr) {
          if (err) {
            // TODO: Handle error.
          }

          if (--protocolsLeft == 0) {
            writeDone();
          }
        });
      }

      function writeDone() {
        res.redirect('overview');
      }
    }
  });
};

// TODO: Actual server-side validation. This might not be necessary because the chance of any of the users tampering with the POST-data or JavaScript validation is unlikely.
function validateForm(req, callback) {
  var loggedIn = req.session.user.username;
  var newProtocols = [];
  var protocols = [];
  var protocolsToUpdate = [];
  var debtors = req.body.debtors;

  // Make sure that debtors is a list, or else .length will give the wrong value.
  debtors = debtors instanceof Array?debtors:[debtors];
  var price = parseFloat(req.body.price);
  var debt = price / debtors.length; 

  //Remove logged in user from the debtors.
  if (debtors[0]==loggedIn) { debtors.shift() }

  // Find who the logged in user owes money.
  var finds = [];
  // Create the finds and remove yourself from debtors.
  for (var i = 0; i < debtors.length; i++) {
    finds.push(Protocols
        .find({ debtor: loggedIn,
                buyer: debtors[i]
        })
        .sort({ date: 1 }));
  }

  var findsLeft = finds.length;
  // Execute the finds.
  for (var i in finds) {
    order(i, finds[i]);
  }

  function order(i, find) {
    find.exec(function(err, result) {
      if (err) {
        // TODO: Handle error.
      }

      console.log(result);
      protocols[i] = result;
      if (--findsLeft == 0) {
        done();
      }
    });
  }
  
  function done() { 
    for (var i in debtors) {

      // Go through the old protocols and change the debtLeft.
      var debtLeft = debt;
      for (var j in protocols[i]) {
        debtLeft = debt;
        if (debtLeft <= protocols[i][j].debtLeft) {
          protocols[i][j].debtLeft -= debtLeft;
          debtLeft = 0;
          protocolsToUpdate.push(protocols[i][j]);
          break;
        } else {
          debtLeft -= protocols[i][j].debtLeft;
          protocols[i][j].debtLeft = 0;
          protocolsToUpdate.push(protocols[i][j]);
        }
      }

      newProtocols.push(new Protocols({
        buyer: loggedIn,
        date: req.body.date,
        ware: req.body.ware,
        debtor: debtors[i],
        originalDebt: debt,
        debtLeft: debtLeft
      }));
    }

    callback(null, protocolsToUpdate, newProtocols);
  }
};
