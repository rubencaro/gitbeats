var Auth = React.createClass({

  apply: function(e) {
    e.preventDefault();
    this.props.main.refresh({
      username: this.refs.username.getDOMNode().value
    });
  },

  render: function() {
    return (
      <form onSubmit={this.apply}>
        <input ref="username" type="text" placeholder="GitHub username" />
        <input ref="token" id="token" type="text" placeholder="Personal API token" />
        <input type="submit" value="Apply" />
      </form>
    );
  }
});

module.exports = Auth;
