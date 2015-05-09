<main>
  <h1>
    GitBeats
    <small>• your GitHub vitals</small>
  </h1>
  <auth></auth>
  <events></events>

  <script>
    this.on('mount', function() {
      opts.app.mount('auth');
      opts.app.mount('events');
    })
  </script>

</main>
