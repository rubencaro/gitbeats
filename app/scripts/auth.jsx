var Auth = React.createClass({

  apply: function(e) {
    e.preventDefault();
    require('app').startDataGathering(this.props.main);
  },

  render: function() {
    return (
      <form onSubmit={this.apply}>
        <input id="username" type="text" placeholder="GitHub username" />
        <input id="token" type="text" placeholder="Personal API token" />
        <input type="submit" value="Apply" />
      </form>
    );
  }
});

module.exports = Auth;
