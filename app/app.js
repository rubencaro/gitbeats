"use strict";

var App = {
  init: function() {
    require('scripts/auth');
    riot.mount('auth');
    require('scripts/events');
    riot.mount('events', this);
    console.log('App initialized.');
  },

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

  // calls riot.mount for the given tag, passing the JSON response
  // from the given url
  mount: function(tag,url){
    get(url)
    .done(function(json){ riot.mount(tag,json) })
    .fail(function(jqXHR, textStatus){ console.log(textStatus) })
    .always(function(){ console.log('done') })
  }
};

module.exports = App;
