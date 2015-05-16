var Events = React.createClass({

  render: function() {

    if(!this.state) return(<div>No Data</div>);

    var evts = 'No Data';
    if(this.state.events && this.state.events.length > 0){
      evts = this.state.events.map(function(evt,k){
        return ( <li key={k}>{evt.repo.name}: {evt.type}</li> );
      });
    }

    var repos = [];
    if(this.state.repos && this.state.repos.size > 0){
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
