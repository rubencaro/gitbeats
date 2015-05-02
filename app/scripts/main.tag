<main>
  <h1>
    GitBeats
    <small>• your GitHub vitals</small>
  </h1>
  <events></events>

  <script>
    this.on('mount', function() {
      opts.app.mount('events');
    })
  </script>

</main>
