var Auth = require('scripts/auth');

var Main = React.createClass({
  render: function() {
    return (
      <div>
        <h1>
          GitBeats <small> • your GitHub vitals</small>
        </h1>
        <Auth></Auth>
      </div>
    );
  }
});


React.render(
  <Main/>,
  document.getElementById('main')
);
