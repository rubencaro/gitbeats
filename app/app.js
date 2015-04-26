"use strict";

var App = {
  init: function() {
    console.log('App initialized.');

    riot.mount('events');
  },

  // returns the promisable jqXHR object
  get: function(url) {
    $.ajax({
      dataType: "json",
      url: url,
      crossDomain: true,
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', "Basic " + btoa("tokenhere:x-oauth-basic"));
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
