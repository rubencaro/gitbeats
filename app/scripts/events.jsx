var Events = React.createClass({

  render: function() {

    var evts = 'No Data';
    if(this.props.events && this.props.events.length > 0){
      evts = this.props.events.map(function(evt,k){
        return ( <li key={k}>{evt.repo.name}: {evt.type}</li> );
      });
    }

    // var repos = [];
    // if(this.state.repos && this.state.repos.size > 0){
    //   this.state.repos.forEach(function(v,k){
    //     repos.push( <li key={k}>{k}: {v}</li> );
    //   });
    // }

    return (
      <div>
        <ul>{evts}</ul>
      </div>
    );
  }
});

module.exports = Events;
