"use strict";

var App = {

  init: function() {
    require('scripts/main');
    console.log('App initialized.');
  },

  // make the ajax call adding the host and the Auth header
  // returns the promisable fetch object, with the parsed JSON as parameter
  get: function(path) {
    var token = document.querySelector('#token').value;

    var h = new Headers();
    h.append('Content-Type', 'application/json');
    h.append('Authorization', "Basic " + btoa(token + ":x-oauth-basic"));

    return fetch('https://api.github.com' + path, { headers: h, mode: 'cors' })
      .then(function(r){ return r.json(); })
  },

};

module.exports = App;
