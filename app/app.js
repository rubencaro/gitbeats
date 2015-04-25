"use strict";

var App = {
  init: function init() {
    console.log('App initialized.');
    $.ajax({
      dataType: "json",
      url: "https://api.github.com/repos/admanmedia/rita/languages",
      success: function(json){ console.log(json) },
      crossDomain: true,
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', "Basic " + btoa("tokenhere:x-oauth-basic"));
      }
    });
  }
};

module.exports = App;
