<events>

  <script>
    this.on('update', function() {
      // get data for children
      var user = $('#username').val();
      console.log('user ' + user);
      if(typeof user == 'undefined'){ return; }
      console.log('hey')
      var url = 'https://api.github.com/users/' + user + '/events';
      opts.app.get(url)
      .done(function(json){ opts.events = json })
      .fail(function(jqXHR,msg){ opts.error = msg })
    })
  </script>

  <div each={ ev in opts.events }>
    { ev }
  </div>

  <div if={ opts.error }>
    { opts.error }
  </div>

</events>
