var Auth = React.createClass({
  render: function() {
    return (
      <div>
        <input id="username" type="text" placeholder="GitHub username" />
        <input id="password" type="text" placeholder="Personal API token" />
        <button>Apply</button>
      </div>
    );
  }
});

module.exports = Auth;
