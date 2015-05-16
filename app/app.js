"use strict";

var App = {

  init: function() {
    require('scripts/main');
    console.log('App initialized.');
  },

  // helper to fire given custom event and pass it the given data
  fire: function(event, data) {
    var event = new CustomEvent(event, { 'detail': data });
    window.dispatchEvent(event);
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

  // main entry point for the state calculation
  startDataGathering: function(main) {
    var data = {};
    data.username = document.querySelector('#username').value;

    // get every events page of the 10 max, and save the events
    data.events = [];
    for(var i = 1; i < 2; i++) this.getEventsPage(data, main, i);

    // // calc event count by repo
    // data.repoEvents = new Map();
    // this.guessRepoEventFrequency(data);
    //
    // // gather contributors for each repo
    // data.repoContributors = new Map();
    // data.repoEvents.forEach(function(v, k){
    //     that.gatherRepoContributors(data, k);
    //   });

  },

  getEventsPage: function(data, main, page) {
    this.get("/users/" + data.username + "/events?page=" + page)
      .then(function(json){
          main.setState(function(prev){ return prev.events.concat(json); });
        });
  },

  // calc repo event frequency
  guessRepoEventFrequency: function(data) {
    for(var evt in data.events){
      var k = evt.repo.name, v = 1, p = data.repoEvents.get(k);
      if(p) v = p + 1;
      data.repoEvents.set(k, v);
    }
  },

  gatherRepoContributors: function(data, repo) {
    this.props.main.get("/repos/" + repo + "/stats/contributors")
      .then(function(json){
        data.repoContributors.set(repo,json);
        that.setState(function(prev){
            return this.saveContributors(prev,json);
        });
      });
  },

};

module.exports = App;
