var Repo = React.createClass({
  render: function() {

    var repos = [];
    if(this.state.repos.size > 0){
      this.state.repos.forEach(function(v,k){
        repos.push( <li key={k}>{k}: {v}</li> );
      });
    }

    return (
      <div>
        <ul ref="repos">{repos}</ul>
      </div>
    );
  }
});

module.exports = Repo;
