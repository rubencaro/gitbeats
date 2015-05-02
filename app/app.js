"use strict";

var App = {
  init: function() {
    this.mount('auth');
    this.mount('main');
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
    require('scripts/' + tag);
    riot.mount(tag, { app: this });
  },


};

module.exports = App;
