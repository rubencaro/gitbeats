"use strict";

var App = {

  main: undefined,

  init: function() {
    this.main = this.mount('main')[0];
    console.dir(this.main);
    console.log('App initialized.');
  },

  // make the ajax call adding the Auth header
  // returns the promisable jqXHR object
  get: function(url) {
    return $.ajax({
      dataType: "json",
      url: url,
      crossDomain: true,
      beforeSend: function(xhr) {
        var token = $('#token').val();
        xhr.setRequestHeader('Authorization', "Basic " + btoa(token + ":x-oauth-basic"));
      }
    });
  },

  // make get request and return the response json data, or the error
  request: function(url) {
    var res = {};
    // get
    this.get(url)
    .done(function(data){ res.data = data; })
    .fail(function(jqXHR, textStatus){ res.error = textStatus; })
    .always(function(){ console.dir(res) })
    return res;
  },

  // calls riot.mount for the given tag
  mount: function(tag){
    // require & mount
    require('tags/' + tag);
    return riot.mount(tag, { app: this });
  },

  refresh: function(e,app){
    app.main.update();
  },

};

module.exports = App;
