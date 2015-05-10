var Auth = require('scripts/auth');
var Events = require('scripts/events');

var Main = React.createClass({

  // tell everyone interested to refresh its data
  refresh: function(data) {
    this.refs.events.refresh(data);
  },

  render: function() {
    return (
      <div>
        <h1> GitBeats <small> • your GitHub vitals</small> </h1>
        <Auth main={this}></Auth>
        <Events ref="events"></Events>
      </div>
    );
  }
});


React.render(
  <Main></Main>,
  document.getElementById('main')
);
