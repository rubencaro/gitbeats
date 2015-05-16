var Repos = React.createClass({

  getInitialState: function() { return {repos: new Map()}; },

  componentDidMount: function() {
    window.addEventListener('refreshRepos', this.handleRefresh);
  },

  componentWillUnmount: function() {
    window.removeEventListener('refreshRepos', this.handleRefresh);
  },

  handleRefresh: function(e) {
    var repos = e.detail.repos,
        main = e.detail.main,
        that = this;

    if(!repos || repos.size == 0) return;

    repos.forEach(function(v,k){
      main.get("/repos/" + k + "/stats/contributors")
        .then(function(json){
          that.setState(function(prev){ return this.saveContributors(prev,json); });
        });
    });
  },

  saveContributors: function(prev,json) {
    // save contributors' data
    console.dir(json);
    return {contributors: []};
  },

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

module.exports = Repos;
