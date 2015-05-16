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

};

module.exports = App;

});

require.register("scripts/auth", function(exports, require, module) {
var Auth = React.createClass({displayName: 'Auth',

  apply: function(e) {
    e.preventDefault();
    this.props.main.refreshEvents({
      username: this.refs.username.getDOMNode().value
    });
  },

  render: function() {
    return (
      React.createElement("form", {onSubmit: this.apply}, 
        React.createElement("input", {ref: "username", type: "text", placeholder: "GitHub username"}), 
        React.createElement("input", {ref: "token", id: "token", type: "text", placeholder: "Personal API token"}), 
        React.createElement("input", {type: "submit", value: "Apply"})
      )
    );
  }
});

module.exports = Auth;

});

require.register("scripts/events", function(exports, require, module) {
var Events = React.createClass({displayName: 'Events',

  getInitialState: function() { return {events: [], repos: new Map()}; },

  refresh: function(data) {
    this.setState(this.getInitialState());
    for(var i = 1; i < 2; i++) this.getPage(data,i);
  },

  getPage: function(data,page){
    var that = this;
    this.props.main.get("/users/" + data.username + "/events?page=" + page)
      .then(function(json){
        that.setState(function(prev){ return this.saveState(prev,json); });
      });
  },

  saveState: function(prev,json){
    // save repo event frequency
    for(var evt of json){
      var k = evt.repo.name, v = 1, p = prev.repos.get(k);
      if(p) v = p + 1;
      prev.repos.set(k, v);
    }

    this.props.main.fire('refreshRepos', { main: this.props.main,
                                           repos: prev.repos });

    return {events: prev.events.concat(json), repos: prev.repos};
  },

  render: function() {

    var evts = 'No Data';
    if(this.state.events.length > 0){
      evts = this.state.events.map(function(evt,k){
        return ( React.createElement("li", {key: k}, evt.repo.name, ": ", evt.type) );
      });
    }

    var repos = [];
    if(this.state.repos.size > 0){
      this.state.repos.forEach(function(v,k){
        repos.push( React.createElement("li", {key: k}, k, ": ", v) );
      });
    }

    return (
      React.createElement("div", null, 
        React.createElement("ul", null, repos), 
        React.createElement("ul", {ref: "events"}, evts)
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
      React.createElement("div", null, 
        React.createElement("h1", null, " GitBeats ", React.createElement("small", null, " • your GitHub vitals"), " "), 
        React.createElement(Auth, {main: this}), 
        React.createElement(Events, {ref: "events", main: this}), 
        React.createElement(Repos, {ref: "repos", main: this})
      )
    );
  }
});

React.render(
  React.createElement(Main, null),
  document.getElementById('main')
);

});

require.register("scripts/repos", function(exports, require, module) {
var Repos = React.createClass({displayName: 'Repos',

  getInitialState: function() { return {repos: new Map()}; },

  componentDidMount: function() {
    window.addEventListener('refreshRepos', this.handleRefresh);
  },

  componentWillUnmount: function() {
    window.removeEventListener('refreshRepos', this.handleRefresh);
  },

  handleRefresh: function(e) {
    var repos = e.detail.repos,
        main = e.detail.main,
        that = this;

    if(!repos || repos.size == 0) return;

    repos.forEach(function(v,k){
      main.get("/repos/" + k + "/stats/contributors")
        .then(function(json){
          that.setState(function(prev){ return this.saveContributors(prev,json); });
        });
    });
  },

  saveContributors: function(prev,json) {
    // save contributors' data
    console.dir(json);
    return {contributors: []};
  },

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

module.exports = Repos;

});


//# sourceMappingURL=app.js.map