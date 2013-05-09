var Users = require('../models/users')
  , Protocols = require('../models/protocols');

// Generate a list of what you owe each of the other users.
module.exports = function generateOverview(loggedIn, callback) {
  var finds = [];
  var results = [];

  // Get the users (needed for full names).
  finds.push(Users.find());

  // Get what you owe.
  finds.push(Protocols.find({
    debtor: loggedIn,
    debtLeft: { $gt: 0 }
  }));

  // Get what other owe you.
  finds.push(Protocols.find({
    buyer: loggedIn,
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
        callback(err);
      }

      results[i] = result;
      if (--findsLeft == 0) {
        done();
      }
    });
  }

  // Called when all the finds are done.
  function done(){
    var overview = {};
    var users =   results[0];
    var youOwe =  results[1];
    var owedYou = results[2];

    // Create list, initially you owe 0;
    for (var i in users) {
      if (users[i].username == loggedIn) {
        continue;
      }

      overview[users[i].username] = {
        owed: 0,
        name: users[i].name,
        username: users[i].username
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
    for (var key in overview) {
      var number = overview[key].owed;

      // Use two decimals and use ',' instead of '.' (norwegian standard).
      number = number.toFixed(2).replace('.', ',');

      // Add a space if the number is above 999.99. (ex. 1 000.33).
      var len = number.length;
      number =len>6?number.substring(0, len-6)+' '+number.substring(len-6):number;

      overview[key].owedFormatted = number;  
    }

    callback(null, overview);
  }
}
