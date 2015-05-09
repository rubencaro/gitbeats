"use strict";

var App = {

  init: function() {
    // var url = 'https://api.github.com/users/' + user + '/events';
    // var url = 'https://api.admanmedia.com/fakeurl';
    // this.get(url).then(function(r){ console.dir(r); });
    require('scripts/main');
    console.log('App initialized.');
  },

  // make the ajax call adding the host and the Auth header
  // returns the promisable fetch object, with the parsed JSON as parameter
  get: function(path) {
    var token = 'token';

    var h = new Headers();
    h.append('Content-Type', 'application/json');
    h.append('Authorization', "Basic " + btoa(token + ":x-oauth-basic"));

    return fetch('https://api.github.com/' + path, { headers: h, mode: 'cors' })
      .then(function(r){
        console.dir(r);
        return r.json();
      })
  },

};

module.exports = App;
