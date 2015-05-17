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
        <Events events={this.state.events}></Events>
      </div>
    );
  }
});
// <RepoEventFrequencies events={this.state.events}></RepoEventFrequencies>
// <Repos repos={this.state.repos}></Repos>

React.render(
  <Main></Main>,
  document.getElementById('main')
);
