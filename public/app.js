(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var has = ({}).hasOwnProperty;

  var aliases = {};

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf('components/' === 0)) {
        start = 'components/'.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return 'components/' + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part === '..') {
          results.pop();
        } else if (part !== '.' && part !== '') {
          results.push(part);
        }
      }
      return results.join('/');
    };
  })();
  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  globals.require = require;
})();
require.register("app", function(exports, require, module) {
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
  // returns the promisable fetch object
  get: function(path) {
    var token = document.querySelector('#token').value;

    var h = new Headers();
    h.append('Content-Type', 'application/json');
    h.append('Authorization', "Basic " + btoa(token + ":x-oauth-basic"));

    return fetch('https://api.github.com' + path, { headers: h, mode: 'cors' })
  },

  // main entry point for the state calculation
  startDataGathering: function(main) {
    var data = {};
    data.username = document.querySelector('#username').value;

    // get every events page of the 10 max, and save the events
    main.setState({events: []});
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
      .then(function(r){return r.json()}).then(function(json){
          main.setState(function(prev){
              return {events: prev.events.concat(json)};
            });
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

});

require.register("scripts/auth", function(exports, require, module) {
var Auth = React.createClass({displayName: 'Auth',

  apply: function(e) {
    e.preventDefault();
    require('app').startDataGathering(this.props.main);
  },

  render: function() {
    return (
      React.createElement("form", {onSubmit: this.apply}, 
        React.createElement("input", {id: "username", type: "text", placeholder: "GitHub username"}), 
        React.createElement("input", {id: "token", type: "text", placeholder: "Personal API token"}), 
        React.createElement("input", {type: "submit", value: "Apply"})
      )
    );
  }
});

module.exports = Auth;

});

require.register("scripts/events", function(exports, require, module) {
var Events = React.createClass({displayName: 'Events',

  render: function() {

    var evts = 'No Data';
    if(this.props.events && this.props.events.length > 0){
      evts = this.props.events.map(function(evt,k){
        return ( React.createElement("li", {key: k}, evt.repo.name, ": ", evt.type) );
      });
    }

    // var repos = [];
    // if(this.state.repos && this.state.repos.size > 0){
    //   this.state.repos.forEach(function(v,k){
    //     repos.push( <li key={k}>{k}: {v}</li> );
    //   });
    // }

    return (
      React.createElement("div", null, 
        React.createElement("ul", null, evts)
      )
    );
  }
});

module.exports = Events;

});

require.register("scripts/main", function(exports, require, module) {
var Auth = require('scripts/auth');
var Events = require('scripts/events');
var Repos = require('scripts/repos');

var Main = React.createClass({displayName: 'Main',

  getInitialState: function() { return {events: []}; },

  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("h1", null, " GitBeats ", React.createElement("small", null, " • your GitHub vitals"), " "), 
        React.createElement(Auth, {main: this}), 
        React.createElement(Events, {events: this.state.events})
      )
    );
  }
});
// <RepoEventFrequencies events={this.state.events}></RepoEventFrequencies>
// <Repos repos={this.state.repos}></Repos>

React.render(
  React.createElement(Main, null),
  document.getElementById('main')
);

});

require.register("scripts/repo", function(exports, require, module) {
var Repo = React.createClass({displayName: 'Repo',
  render: function() {

    var repos = [];
    if(this.state.repos.size > 0){
      this.state.repos.forEach(function(v,k){
        repos.push( React.createElement("li", {key: k}, k, ": ", v) );
      });
    }

    return (
      React.createElement("div", null, 
        React.createElement("ul", {ref: "repos"}, repos)
      )
    );
  }
});

module.exports = Repo;

});

require.register("scripts/repos", function(exports, require, module) {
var Repo = require('scripts/repo');

var Repos = React.createClass({displayName: 'Repos',

  render: function() {

    var repos = [];
    if(this.state && this.state.repos && this.state.repos.size > 0){
      this.state.repos.forEach(function(v,k){
        repos.push( React.createElement(Repo, {key: k, name: k}) );
      });
    }

    return (
      React.createElement("div", {ref: "repos"}, 
        repos
      )
    );
  }
});

module.exports = Repos;

});


//# sourceMappingURL=app.js.map