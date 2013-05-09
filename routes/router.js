var restrict = require('./restrict');

var handler = {};
handler['/'] = require('./index');
handler['/login'] = require('./login');
handler['/logout'] = require('./logout');
handler['/main'] = require('./main');
handler['/create'] = require('./create');
handler['/overview'] = require('./overview');
handler['/clear'] = require('./clear');

module.exports = function (app) {
  for(var route in handler){
    if(handler[route].get){
      if (handler[route].restrict) {
        app.get(route, restrict, handler[route].get);
      } else {
        app.get(route, handler[route].get);
      }
    }
    
    if (handler[route].post) {
      if (handler[route].restrict) {
        app.post(route, restrict, handler[route].post);
      } else {
        app.post(route, handler[route].post);
      }
    }
  }
};
