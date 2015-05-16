var Auth = require('scripts/auth');
var Events = require('scripts/events');
var Repos = require('scripts/repos');

var Main = React.createClass({

  getInitialState: function() { return {events: []}; },

  render: function() {
    return (
      <div>
        <h1> GitBeats <small> • your GitHub vitals</small> </h1>
        <Auth main={this}></Auth>
        <Events ref="events" main={this}></Events>
        <Repos ref="repos" main={this}></Repos>
      </div>
    );
  }
});

React.render(
  <Main></Main>,
  document.getElementById('main')
);
