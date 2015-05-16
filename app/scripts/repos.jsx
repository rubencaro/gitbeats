var Repo = require('scripts/repo');

var Repos = React.createClass({

  render: function() {

    var repos = [];
    if(this.state && this.state.repos && this.state.repos.size > 0){
      this.state.repos.forEach(function(v,k){
        repos.push( <Repo key={k} name={k}></Repo> );
      });
    }

    return (
      <div ref="repos">
        {repos}
      </div>
    );
  }
});

module.exports = Repos;
