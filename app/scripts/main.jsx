var Auth = require('scripts/auth');
var Events = require('scripts/events');
var Repos = require('scripts/repos');

var Main = React.createClass({

  refreshEvents: function(data) {
    this.refs.events.refresh(data);
  },

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

  render: function() {
    return (
      <div>
        <h1> GitBeats <small> • your GitHub vitals</small> </h1>
        <Auth main={this}></Auth>
        <Events ref="events" main={this}></Events>
        <Repos ref="repos" main={this}></Repos>
      </div>
    );
  }
});

React.render(
  <Main></Main>,
  document.getElementById('main')
);
