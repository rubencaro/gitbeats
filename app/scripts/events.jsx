var Events = React.createClass({

  app: require('app'),

  getInitialState: function() { return {events: [], repos: new Map()}; },

  refresh: function(data) {
    this.setState(this.getInitialState());
    for(var i = 1; i < 3; i++) this.getPage(data,i);
  },

  getPage: function(data,page){
    var that = this;
    this.app.get("/users/" + data.username + "/events?page=" + page)
      .then(function(json){
        that.setState(function(prev){ return this.saveState(prev,json); });
      });
  },

  saveState: function(prev,json){
    // save repo event frequency
    for(var evt of json){
      var k = evt.repo.name, v = 1, p = prev.repos.get(k);
      if(p) v = p + 1;
      prev.repos.set(k, v);
    }
    return {events: prev.events.concat(json), repos: prev.repos};
  },

  render: function() {

    var evts = 'No Data';
    if(this.state.events.length > 0){
      evts = this.state.events.map(function(evt,k){
        return ( <li key={k}>{evt.repo.name}: {evt.type}</li> );
      });
    }

    var repos = [];
    if(this.state.repos.size > 0){
      this.state.repos.forEach(function(v,k){
        repos.push( <li key={k}>{k}: {v}</li> );
      });
    }

    return (
      <div>
        <ul>{repos}</ul>
        <ul ref="events">{evts}</ul>
      </div>
    );
  }
});

module.exports = Events;
