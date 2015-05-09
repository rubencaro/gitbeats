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

});

require.register("scripts/auth", function(exports, require, module) {
var Auth = React.createClass({displayName: 'Auth',
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("input", {id: "username", type: "text", placeholder: "GitHub username"}), 
        React.createElement("input", {id: "password", type: "text", placeholder: "Personal API token"}), 
        React.createElement("button", null, "Apply")
      )
    );
  }
});

module.exports = Auth;

});

require.register("scripts/main", function(exports, require, module) {
var Auth = require('scripts/auth');

var Main = React.createClass({displayName: 'Main',
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("h1", null, 
          "GitBeats ", React.createElement("small", null, " • your GitHub vitals")
        ), 
        React.createElement(Auth, null)
      )
    );
  }
});


React.render(
  React.createElement(Main, null),
  document.getElementById('main')
);

});


//# sourceMappingURL=app.js.map