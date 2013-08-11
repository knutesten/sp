var Users     = require('../models/users')
  , Protocols = require('../models/protocols')
  , formatNumber = require('./format-number');

// Get all protocols associated with this user, as well as the users.
module.exports = function getProtocolList(loggedIn, callback) {
  Protocols
    .find({$or: [ 
      { debtor: loggedIn }, 
      { buyer:  loggedIn }]})
    .sort({ debtLeft: -1,  date: -1 })
    .exec(function (err, results) {
      if (err) {
        callback(err);
      }

      for (var i in results) {
        results[i].originalDebtFormatted = formatNumber(results[i].originalDebt);
        results[i].debtLeftFormatted = formatNumber(results[i].debtLeft);
      }

      callback(null, results);
    });
}

// Returns lists of protocols for each user sorted by date.
/*
 *module.exports = function getProtocolList(loggedIn, callback){
 *  var finds = [];
 *  var results = [];
 *  var usersList = {};
 *
 *  // Get the usernames.
 *  Users.find().exec(function (err, users) {
 *    for (var i in users) {
 *      usersList[users[i].username] = users[i].name;
 *
 *      if (users[i].username == loggedIn) {
 *        continue;
 *      }
 *      
 *      // Create finds that group each other user in a list
 *      finds.push(Protocols
 *        .find({$or: [ 
 *          {debtor: loggedIn, buyer:  users[i].username }, 
 *          {buyer:  loggedIn, debtor: users[i].username }]})
 *        .sort({ debtLeft: -1,  date: -1 })
 *      );
 *    }
 *
 *    // Start all the finds in parallel.
 *    var findsLeft = finds.length;
 *    for (var i in finds) {
 *      order(i, finds[i]);
 *    }
 *
 *    // Function for keeping the correct order in the results list.
 *    function order(i, find) {
 *      find.execFind(function (err, result) {
 *        if (err) {
 *          callback(err);
 *        }
 *
 *        results[i] = {
 *          username: users[i].username,
 *          name: users[i].name,
 *          protocols: result
 *        };
 *
 *        if (--findsLeft == 0) {
 *          done();
 *        }
 *      });
 *    }
 *
 *    function done() {
 *      callback(null, results, usersList);
 *    }
 *  });
 *}
 */
