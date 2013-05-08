var Protocols = require('../models/protocols')
  , Users = require('../models/users');

exports.restrict = true;

exports.get = function (req, res) {
  // Get the signed in user
  var logedIn = req.session.user.username;
  var finds = [];
  var results = [];

  // Get the users (needed for full names).
  finds.push(Users.find());

  // Get what you owe.
  finds.push(Protocols.find({
    debtor: logedIn,
    debtLeft: { $gt: 0 }
  }));

  // Get what other owe you.
  finds.push(Protocols.find({
    buyer: logedIn,
    debtLeft: { $gt: 0 }
  }));
 
  // Start all the finds in parallel.
  var findsLeft = finds.length;
  for (var i in finds) {
    order(i, finds[i]);
  }

  // Function for keeping the correct order in the results list.
  function order(i, find) {
    find.execFind(function (err, result) {
      if (err) {
        // TODO: Handle error.
      }

      results[i] = result;
      if (--findsLeft == 0) {
        done();
      }
    });
  }
 
  // Called when all the finds are done.
  function done(){
    res.render('overview', 
        { logedIn: logedIn, 
          overview: generateOverview()
        }
    );
  }

  // Generate a list of what you owe each of the other users.
  function generateOverview() {
    var overview = {};
    var users =   results[0];
    var youOwe =  results[1];
    var owedYou = results[2];

    // Create list, initially you owe 0;
    for (var i in users) {
      if (users[i].username == logedIn) {
        continue;
      }

      overview[users[i].username] = {
        owed: 0,
        name: users[i].name
      };
    }

    // Add what you owe to each respective user.
    for (var i in youOwe) {
      overview[youOwe[i].buyer].owed += youOwe[i].debtLeft;
    }

    // Remove what each user owes you.
    for (var i in owedYou) {
      overview[owedYou[i].debtor].owed -= owedYou[i].debtLeft
    }

    // Format numbers

    return overview;
  }
};
