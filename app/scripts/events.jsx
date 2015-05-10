var Events = React.createClass({

  refresh: function(data) {
    var that = this;
    require('app').get("/users/" + data.username + "/events")
      .then(function(json){ that.setState({events: json}); });
  },

  getInitialState: function() { return {events: []}; },

  render: function() {

    var body = 'No Data';

    if(this.state.events.length > 0){
      body = this.state.events.map(function(evt,k){
        return ( <li key={k}>{evt.repo.name}: {evt.type}</li> );
      });
    }

    return (
      <ul ref="events">{body}</ul>
    );
  }
});

module.exports = Events;
