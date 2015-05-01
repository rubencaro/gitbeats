<events>

  <script>
    this.on('mount', function() {
      // get data for children
      var user = $('#username').val();
      var events = opts.get('https://api.github.com/users/' + user + '/events');
      console.dir(events);
    })
  </script>

  <div>

  </div>
</events>
