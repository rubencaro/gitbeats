"use strict";

var App = {

  init: function() {
    var user = 'rubencaro';
    var url = 'https://api.github.com/users/' + user + '/events';
    this.get(url).then(function(r){ console.dir(r); });
    console.log('App initialized.');
  },

  // make the ajax call adding the Auth header
  // returns the promisable fetch object, with the parsed JSON as parameter
  get: function(url) {

    var h = new Headers();
    h.append('Content-Type', 'application/json');
    h.append('Authorization', "Basic " + btoa(token + ":x-oauth-basic"));

    var r = new Request(url, { headers: h, mode: 'cors' });

    return fetch(r).then(function(r){ return r.json() })
  },

};

module.exports = App;
